import LoginForm from '@/features/auth/components/LoginForm';

const LoginPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <p className="text-muted-foreground">
          Sign in to manage the SaaS platform
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
