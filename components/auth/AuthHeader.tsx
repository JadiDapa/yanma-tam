interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="">
      <div className="">
        <div className="flex items-center flex-col justify-center text-center">
          <p className="text-4xl font-semibold tracking-wide">YANMA</p>
          <p className="text-lg">Taruna Anugerah Mandiri</p>
        </div>
      </div>

      <p className="mx-auto mt-2 max-w-sm text-center text-sm">{subtitle}</p>
    </div>
  );
}
