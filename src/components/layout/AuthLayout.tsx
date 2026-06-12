import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-card p-6 sm:p-8 rounded-xl border">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
