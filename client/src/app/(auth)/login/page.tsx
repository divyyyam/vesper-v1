import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/ui-elements/forms/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up with confidence."
      description="Your documents, conversations, and consultations stay together in one focused legal workspace."
    >
      <LoginForm />
    </AuthShell>
  );
}
