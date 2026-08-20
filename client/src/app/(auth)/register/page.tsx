import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/ui-elements/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create your workspace"
      title="Legal help, minus the friction."
      description="Start with a question, understand the issue, and bring in a verified professional when you need one."
    >
      <RegisterForm />
    </AuthShell>
  );
}
