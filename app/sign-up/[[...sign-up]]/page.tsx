import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
      <SignUp routing="path" path="/sign-up" />
    </main>
  );
}
