import LoginForm from "./loginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
