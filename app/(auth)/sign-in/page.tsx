import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";

export default async function SignInPage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) redirect("/");

  return (
    <section className="bg-background flex min-h-screen relative overflow-hidden py-12 lg:px-28">
      <main className="bg-card relative flex lg:w-[45%] flex-col items-center rounded-2xl justify-center p-8 shadow-xl lg:px-24">
        <AuthHeader
          title="Sign In Now!"
          subtitle="Sebelum melangkah lebih lanjut, silahkan masuk terlebih dahulu!"
        />
        <SignInForm />
        <p className="mt-4 text-center lg:mt-6">
          Belum memiliki akun?{" "}
          <Link className="text-primary underline" href="/sign-up">
            Daftar Sekarang!
          </Link>
        </p>
      </main>
    </section>
  );
}
