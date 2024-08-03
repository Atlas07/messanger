import SignupForm from "./SignupForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center md:h-screen">
      <p className="text-7xl mb-10">Sign up</p>
      <SignupForm />
    </main>
  );
}
