import AuthCarousel from "@/components/auth/AuthCarousel";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import AuthHeader from "@/components/auth/AuthHeader";
import Link from "next/link";

export default async function SignInPage() {
  return (
    <section className="flex min-h-screen relative overflow-hidden py-12 px-28">
      <AuthCarousel />

      <main className="bg-card relative flex w-[45%] flex-col items-center rounded-2xl justify-center  p-8 shadow-xl lg:px-24">
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
