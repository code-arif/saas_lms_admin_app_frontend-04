# Audit Logs API

> Base URL: `/api/v1/audit`
>
> Middleware: `api`, `auth:sanctum`, `role:super_admin|tenant`
>
> Content-Type: `application/json`

---

## Standard Response Envelope

All endpoints return responses in the following structure:

```json
{
  "success": true | false,
  "message": "string",
  "data": {} | [] | null,
  "meta": {},
  "errors": [],
  "pagination": null | {
    "total": 42,
    "per_page": 15,
    "current_page": 1,
    "last_page": 3
  }
}
```

---

## Authentication

All endpoints require a valid **Sanctum** Bearer token and one of the following roles: `super_admin` or `tenant`.

**Header:**
```
Authorization: Bearer {your_token}
Accept: application/json
```

> **Tenant Scope:** Tenant admins can only see audit logs belonging to their own tenant. Super admins see all logs across all tenants.

---

## Event Categories

The audit system records events across these categories:

| Category       | Description                                              |
|----------------|----------------------------------------------------------|
| `auth`         | Authentication events (login, logout, registration, 2FA) |
| `security`     | Security events (challenges, lockouts, suspicious activity) |
| `billing`      | Billing and subscription events (plans, invoices, payments) |
| `content`      | Content management events (courses, lessons, categories) |
| `user`         | User management events (profile updates, role changes) |
| `tenant`       | Tenant management events (settings, config changes) |
| `notification` | Notification events (email, SMS, push sent) |
| `integration`  | Third-party integration events (API calls, webhooks) |
| `system`       | System events (background jobs, data purges) |
| `ai`           | AI service events (content generation, suggestions) |

---

## Audit Log Resource Shape

Every audit log record follows this structure:

```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": 1,
  "user_id": 42,
  "user_type": "admin",
  "user_email": "admin@example.com",
  "event": "login.success",
  "event_category": "auth",
  "auditable": {
    "type": "App\\Models\\User",
    "id": 42
  },
  "changes": {
    "old": null,
    "new": null
  },
  "metadata": {
    "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "admin@example.com",
    "role": "super_admin"
  },
  "context": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0 ...",
    "url": "https://app.example.com/api/v1/auth/super_admin/login",
    "method": "POST"
  },
  "created_at": "2026-06-23T10:00:00.000000Z"
}
```

| Field              | Type         | Description                                                    |
|--------------------|--------------|----------------------------------------------------------------|
| `uuid`             | UUID (v4)    | Public unique identifier                                       |
| `tenant_id`        | int \| null  | Tenant scope (null for super-admin actions)                    |
| `user_id`          | int \| null  | Actor user ID (null for system/anonymous events)               |
| `user_type`        | string \| null | Actor role: `admin`, `tenant`, `instructor`, `student`       |
| `user_email`       | string \| null | Actor email snapshot for historical accuracy                  |
| `event`            | string       | Event name (e.g. `login.success`, `course.created`)           |
| `event_category`   | string       | Category from the table above                                  |
| `auditable`        | object \| null | Target entity `{type, id}` (what was acted upon)             |
| `changes`          | object \| null | `{old, new}` — previous and new state for updates             |
| `metadata`         | object       | Additional context (request ID, custom data)                   |
| `context`          | object       | HTTP context: `{ip_address, user_agent, url, method}`          |
| `created_at`       | ISO 8601     | Immutable timestamp of when the event occurred                 |

---

## 1. List Audit Logs (Paginated)

> `GET /api/v1/audit`

Retrieve a paginated list of audit logs with powerful filtering options.

### Query Parameters

| Parameter         | Type    | Default   | Description                                              |
|-------------------|---------|-----------|----------------------------------------------------------|
| `tenant_id`       | integer | —         | Filter by tenant ID                                      |
| `user_id`         | integer | —         | Filter by user ID                                        |
| `event_category`  | string  | —         | Filter by event category (e.g. `auth`, `billing`)        |
| `event`           | string  | —         | Filter by specific event name (e.g. `login.success`)     |
| `user_type`       | string  | —         | Filter by actor role: `admin`, `tenant`, `instructor`, `student` |
| `user_email`      | string  | —         | Partial email search                                     |
| `ip_address`      | string  | —         | Partial IP address search                                |
| `method`          | string  | —         | Filter by HTTP method: `GET`, `POST`, `PUT`, `DELETE`    |
| `auditable_type`  | string  | —         | Filter by auditable model class (e.g. `App\Models\User`) |
| `search`          | string  | —         | Full-text search across `event`, `user_email`, `ip_address`, `url` |
| `date_from`       | date    | —         | Start date (`Y-m-d`). Must be before or equal to `date_to` |
| `date_to`         | date    | —         | End date (`Y-m-d`). Must be after or equal to `date_from` |
| `per_page`        | integer | `15`      | Items per page (max **100**)                             |
| `page`            | integer | `1`       | Page number                                              |
| `order_by`        | string  | `created_at` | Sort column: `created_at`, `event`, `event_category`, `user_email`, `ip_address` |
| `direction`       | string  | `desc`    | Sort direction: `asc`, `desc`                            |

### Example Request

```
GET /api/v1/audit?event_category=auth&date_from=2026-06-01&date_to=2026-06-30&per_page=10&order_by=created_at&direction=desc
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "items": [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
        "tenant_id": 1,
        "user_id": 42,
        "user_type": "admin",
        "user_email": "admin@example.com",
        "event": "login.success",
        "event_category": "auth",
        "auditable": {
          "type": "App\\Models\\User",
          "id": 42
        },
        "changes": {
          "old": null,
          "new": null
        },
        "metadata": {
          "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          "email": "admin@example.com",
          "role": "super_admin"
        },
        "context": {
          "ip_address": "192.168.1.1",
          "user_agent": "Mozilla/5.0 ...",
          "url": "https://app.example.com/api/v1/auth/super_admin/login",
          "method": "POST"
        },
        "created_at": "2026-06-23T10:00:00.000000Z"
      }
    ]
  },
  "meta": {},
  "errors": [],
  "pagination": {
    "total": 120,
    "per_page": 10,
    "current_page": 1,
    "last_page": 12
  }
}
```

> **Note:** Tenant admins are automatically scoped to their own `tenant_id`. The `tenant_id` filter is overridden for them. Super admins see all logs and can use the `tenant_id` filter to drill down.

---

## 2. Get Single Audit Log

> `GET /api/v1/audit/{uuid}`

Retrieve a specific audit log record by its UUID.

### Path Parameters

| Parameter | Type | Description                    |
|-----------|------|--------------------------------|
| `uuid`    | UUID | The audit log's UUID           |

### Example Request

```
GET /api/v1/audit/550e8400-e29b-41d4-a716-446655440001
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit log retrieved successfully",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "tenant_id": 1,
    "user_id": 42,
    "user_type": "admin",
    "user_email": "admin@example.com",
    "event": "login.success",
    "event_category": "auth",
    "auditable": {
      "type": "App\\Models\\User",
      "id": 42
    },
    "changes": {
      "old": null,
      "new": null
    },
    "metadata": {
      "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    },
    "context": {
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0 ...",
      "url": "https://app.example.com/api/v1/auth/super_admin/login",
      "method": "POST"
    },
    "created_at": "2026-06-23T10:00:00.000000Z"
  },
  "meta": {},
  "errors": [],
  "pagination": null
}
```

> **Authorization:** Tenant admins can only view logs belonging to their tenant. Super admins can view any log.

---

## 3. List Event Categories

> `GET /api/v1/audit/categories`

Retrieve all distinct event categories that have been recorded in the audit logs.

### Query Parameters

None.

### Example Request

```
GET /api/v1/audit/categories
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit categories retrieved",
  "data": {
    "categories": [
      "auth",
      "billing",
      "content",
      "notification",
      "security",
      "system",
      "user"
    ]
  },
  "meta": {},
  "errors": [],
  "pagination": null
}
```

---

## 4. List Events in a Category

> `GET /api/v1/audit/categories/{category}/events`

Retrieve all distinct event names for a specific event category.

### Path Parameters

| Parameter  | Type   | Description                    |
|------------|--------|--------------------------------|
| `category` | string | The event category (e.g. `auth`, `billing`) |

### Example Request

```
GET /api/v1/audit/categories/auth/events
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit events retrieved",
  "data": {
    "category": "auth",
    "events": [
      "login.challenge",
      "login.failed",
      "login.success",
      "logout",
      "register.success",
      "token.refreshed"
    ]
  },
  "meta": {},
  "errors": [],
  "pagination": null
}
```

---

## 5. Summary by Category

> `GET /api/v1/audit/summary/category`

Get aggregated counts of audit logs grouped by event category. Useful for dashboard charts.

### Query Parameters

| Parameter   | Type   | Default | Description                  |
|-------------|--------|---------|------------------------------|
| `date_from` | date   | —       | Start date (`Y-m-d`)         |
| `date_to`   | date   | —       | End date (`Y-m-d`)           |

### Example Request

```
GET /api/v1/audit/summary/category?date_from=2026-06-01&date_to=2026-06-30
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit log summary retrieved",
  "data": {
    "summary": [
      { "category": "auth", "count": 450 },
      { "category": "content", "count": 230 },
      { "category": "billing", "count": 89 },
      { "category": "user", "count": 45 },
      { "category": "security", "count": 12 },
      { "category": "system", "count": 8 }
    ],
    "total": 834
  },
  "meta": {},
  "errors": [],
  "pagination": null
}
```

---

## 6. Summary by Event

> `GET /api/v1/audit/summary/event`

Get aggregated counts of audit logs grouped by individual event name. Can be filtered by category.

### Query Parameters

| Parameter   | Type   | Default | Description                            |
|-------------|--------|---------|----------------------------------------|
| `category`  | string | —       | Filter to a specific event category    |
| `date_from` | date   | —       | Start date (`Y-m-d`)                   |
| `date_to`   | date   | —       | End date (`Y-m-d`)                     |

### Example Request

```
GET /api/v1/audit/summary/event?category=auth&date_from=2026-06-01&date_to=2026-06-30
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit log event summary retrieved",
  "data": {
    "summary": [
      { "event": "login.success", "count": 310 },
      { "event": "login.failed", "count": 85 },
      { "event": "logout", "count": 42 },
      { "event": "register.success", "count": 10 },
      { "event": "login.challenge", "count": 3 }
    ],
    "total": 450
  },
  "meta": {},
  "errors": [],
  "pagination": null
}
```

---

## 7. Count Audit Logs

> `GET /api/v1/audit/count`

Get the total count of audit log records. Optionally filtered by category.

### Query Parameters

| Parameter  | Type   | Default | Description                         |
|------------|--------|---------|-------------------------------------|
| `category` | string | —       | Filter count to a specific category |

### Example Request

```
GET /api/v1/audit/count?category=auth
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Audit log count retrieved",
  "data": {
    "count": 450,
    "category": "auth"
  },
  "meta": {},
  "errors": [],
  "pagination": null
}
```

> When no `category` filter is provided, `category` in the response defaults to `"all"` and returns the total count across all categories.

---

## 8. Logs by User

> `GET /api/v1/audit/user/{userId}`

Retrieve all audit logs for a specific user, with pagination and filtering.

### Path Parameters

| Parameter | Type    | Description         |
|-----------|---------|---------------------|
| `userId`  | integer | The user's ID       |

### Query Parameters

Same filtering query parameters as the **List Audit Logs** endpoint (except `user_id` which is overridden by the path parameter).

| Parameter        | Type    | Default   | Description                                              |
|------------------|---------|-----------|----------------------------------------------------------|
| `event_category` | string  | —         | Filter by event category                                 |
| `event`          | string  | —         | Filter by event name                                     |
| `date_from`      | date    | —         | Start date (`Y-m-d`)                                     |
| `date_to`        | date    | —         | End date (`Y-m-d`)                                       |
| `per_page`       | integer | `15`      | Items per page (max 100)                                 |
| `order_by`       | string  | `created_at` | Sort column                                          |
| `direction`      | string  | `desc`    | Sort direction                                           |

### Example Request

```
GET /api/v1/audit/user/42?event_category=auth&per_page=10
```

### Response `200 OK`

Same structure as the **List Audit Logs** response.

---

## 9. Logs by Tenant

> `GET /api/v1/audit/tenant/{tenantId}`

Retrieve all audit logs for a specific tenant, with pagination and filtering.

### Path Parameters

| Parameter  | Type    | Description           |
|------------|---------|-----------------------|
| `tenantId` | integer | The tenant's ID       |

### Query Parameters

Same filtering query parameters as the **List Audit Logs** endpoint (except `tenant_id` which is overridden by the path parameter).

### Example Request

```
GET /api/v1/audit/tenant/1?event_category=billing&date_from=2026-06-01&per_page=10
```

### Response `200 OK`

Same structure as the **List Audit Logs** response.

---

## 10. Logs by Category

> `GET /api/v1/audit/category/{category}`

Retrieve all audit logs for a specific event category, with pagination and filtering.

### Path Parameters

| Parameter  | Type   | Description                    |
|------------|--------|--------------------------------|
| `category` | string | Event category (e.g. `auth`, `billing`) |

### Query Parameters

Same filtering query parameters as the **List Audit Logs** endpoint (except `event_category` which is overridden by the path parameter).

### Example Request

```
GET /api/v1/audit/category/billing?date_from=2026-06-01&per_page=25
```

### Response `200 OK`

Same structure as the **List Audit Logs** response.

---

## 11. Logs by Auditable Entity

> `GET /api/v1/audit/auditable/{auditableType}/{auditableId}`

Retrieve all audit logs related to a specific entity (e.g., a course, a user, a subscription). The entity is identified by its fully-qualified class name and its ID.

### Path Parameters

| Parameter        | Type    | Description                                                    |
|------------------|---------|----------------------------------------------------------------|
| `auditableType`  | string  | The fully-qualified model class (URL-encoded, e.g. `App\Models\User`) |
| `auditableId`    | integer | The entity's ID                                                |

### Query Parameters

| Parameter   | Type    | Default   | Description                  |
|-------------|---------|-----------|------------------------------|
| `per_page`  | integer | `15`      | Items per page (max 100)     |

### Example Request

```
GET /api/v1/audit/auditable/App%5CModels%5CUser/42
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Entity audit logs retrieved successfully",
  "data": {
    "items": [
      {
        "uuid": "550e8400-e29b-41d4-a716-446655440001",
        "tenant_id": 1,
        "user_id": 42,
        "user_type": "admin",
        "user_email": "admin@example.com",
        "event": "user.profile.updated",
        "event_category": "user",
        "auditable": {
          "type": "App\\Models\\User",
          "id": 42
        },
        "changes": {
          "old": { "name": "John" },
          "new": { "name": "Johnathan" }
        },
        "metadata": {
          "request_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
        },
        "context": {
          "ip_address": "192.168.1.1",
          "user_agent": "Mozilla/5.0 ...",
          "url": "https://app.example.com/api/v1/users/42",
          "method": "PUT"
        },
        "created_at": "2026-06-23T12:00:00.000000Z"
      }
    ]
  },
  "meta": {},
  "errors": [],
  "pagination": {
    "total": 5,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1
  }
}
```

> **Note:** The `auditableType` parameter must be URL-encoded when it contains backslashes. Example: `App\Models\User` → `App%5CModels%5CUser`.

---

## Error Responses

### 401 Unauthenticated

Occurs when no valid Bearer token is provided.

```json
{
  "success": false,
  "message": "Unauthenticated",
  "data": null,
  "meta": {},
  "errors": [],
  "pagination": null
}
```

### 403 Forbidden

Occurs when the authenticated user does not have the required role (`super_admin` or `tenant`).

```json
{
  "success": false,
  "message": "This action is unauthorized.",
  "data": null,
  "meta": {},
  "errors": [],
  "pagination": null
}
```

### 404 Not Found

Occurs when the UUID does not match any audit log record.

```json
{
  "success": false,
  "message": "Audit log not found",
  "data": null,
  "meta": {},
  "errors": ["Audit log not found"],
  "pagination": null
}
```

### 422 Validation Error

Occurs when query parameters fail validation.

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "meta": {},
  "errors": {
    "date_from": ["The start date cannot be after the end date."],
    "per_page": ["Maximum 100 records per page allowed."],
    "direction": ["The selected direction is invalid."]
  },
  "pagination": null
}
```

---

## Request Summary Table

| Method  | Endpoint                                              | Auth Required | Paginated | Description                                    |
|---------|-------------------------------------------------------|---------------|-----------|------------------------------------------------|
| `GET`   | `/api/v1/audit`                                       | Yes           | Yes       | List audit logs with powerful filtering        |
| `GET`   | `/api/v1/audit/{uuid}`                                | Yes           | No        | Get a single audit log by UUID                 |
| `GET`   | `/api/v1/audit/categories`                            | Yes           | No        | List all event categories                      |
| `GET`   | `/api/v1/audit/categories/{category}/events`          | Yes           | No        | List events for a specific category            |
| `GET`   | `/api/v1/audit/summary/category`                      | Yes           | No        | Aggregated count grouped by category           |
| `GET`   | `/api/v1/audit/summary/event`                         | Yes           | No        | Aggregated count grouped by event              |
| `GET`   | `/api/v1/audit/count`                                 | Yes           | No        | Total count of audit logs (optional category filter) |
| `GET`   | `/api/v1/audit/user/{userId}`                         | Yes           | Yes       | Audit logs for a specific user                 |
| `GET`   | `/api/v1/audit/tenant/{tenantId}`                     | Yes           | Yes       | Audit logs for a specific tenant               |
| `GET`   | `/api/v1/audit/category/{category}`                   | Yes           | Yes       | Audit logs for a specific event category       |
| `GET`   | `/api/v1/audit/auditable/{auditableType}/{auditableId}` | Yes         | Yes       | Audit logs for a specific entity (model)       |

---

## Data Model Reference

| Column             | Type                | Description                                        |
|--------------------|---------------------|----------------------------------------------------|
| `uuid`             | UUID (v4)           | Public identifier — used in all API endpoints      |
| `tenant_id`        | bigInteger (nullable)| Tenant scope (multi-tenancy). Null for super-admin actions |
| `user_id`          | bigInteger (nullable)| Actor user ID                                      |
| `user_type`        | string (nullable)   | Actor role: `admin`, `tenant`, `instructor`, `student` |
| `user_email`       | string (nullable)   | Email snapshot at time of event (historical accuracy) |
| `event`            | string              | Event name (e.g. `login.success`, `course.created`) |
| `event_category`   | string              | Category grouping: `auth`, `billing`, `content`, `security`, `system`, `user`, `tenant`, `notification`, `integration`, `ai` |
| `auditable_type`   | string (nullable)   | Fully-qualified model class name (e.g. `App\Models\User`) |
| `auditable_id`     | bigInteger (nullable)| Model ID of the affected entity                    |
| `old_values`       | json (nullable)     | Previous state snapshot (for update events)        |
| `new_values`       | json (nullable)     | New state snapshot (for create/update events)      |
| `metadata`         | json (nullable)     | Additional context (request ID, custom fields)     |
| `ip_address`       | string(45) (nullable)| Client IP address (IPv4 or IPv6)                  |
| `user_agent`       | text (nullable)     | User agent string                                  |
| `url`              | string(2048) (nullable)| Request URL                                     |
| `method`           | string(10) (nullable)| HTTP method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| `created_at`       | timestamp           | Immutable event timestamp (no updated_at — append-only) |

> **Note:** `id` and `uuid` are the only identifiers. The `id` is the auto-increment PK and is hidden from API responses. All public references use `uuid`. The table is **append-only** — records are never updated or soft-deleted.

---

## Common Event Examples

| Category     | Event Name                        | Description                                |
|--------------|-----------------------------------|--------------------------------------------|
| `auth`       | `login.success`                   | Successful login                           |
| `auth`       | `login.failed`                    | Failed login attempt                       |
| `auth`       | `login.challenge`                 | Login requiring 2FA challenge              |
| `auth`       | `logout`                          | User logged out                            |
| `auth`       | `register.success`                | New user registration                      |
| `security`   | `account.locked`                  | Account locked due to failed attempts      |
| `security`   | `password.changed`                | Password changed                           |
| `content`    | `course.created`                  | New course created                         |
| `content`    | `course.updated`                  | Course updated                             |
| `content`    | `course.deleted`                  | Course soft-deleted                        |
| `content`    | `lesson.created`                  | New lesson added to a course               |
| `billing`    | `subscription.created`            | New subscription started                   |
| `billing`    | `subscription.cancelled`          | Subscription cancelled                     |
| `billing`    | `invoice.paid`                    | Invoice payment completed                  |
| `user`       | `user.profile.updated`            | User profile updated                       |
| `user`       | `user.role.changed`               | User role changed                          |
| `system`     | `data.purged`                     | Old data purged per retention policy       |
| `system`     | `job.failed`                      | Background job failure                     |
