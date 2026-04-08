import MainLogo from "@/components/ui_components/MainLogo";
import LoginForm from "@/features/authentication/LoginForm";

function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <MainLogo />

        <h1 className="text-5xl font-semibold text-secondary-foreground">
          Login your account
        </h1>
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;
