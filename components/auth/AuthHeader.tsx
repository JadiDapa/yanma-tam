import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="">
      <div className="">
        <figure className="relative mx-auto w-52 h-24">
          <Image
            src={"https://hapindo.co.id/images/clients/client-2.png"}
            fill
            className="object-contain object-center"
            alt=""
          />
        </figure>
        <div className="text-primary flex items-center justify-center gap-4 text-center text-4xl font-semibold tracking-wide">
          <p>Selamat Datang!</p>
        </div>
      </div>

      <p className="mx-auto mt-2 max-w-sm text-center text-sm">{subtitle}</p>
    </div>
  );
}
