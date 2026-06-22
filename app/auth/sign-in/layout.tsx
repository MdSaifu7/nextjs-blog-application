import Link from "next/link";
// import { Children } from "react"
import Image from "next/image";
export default function SingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-5 left-5 bg-white p-4 rounded-4xl">
        <Link href="/">
          <Image src="/return.png" alt="Go back" width={20} height={20} />
        </Link>
      </div>
      {children}
    </div>
  );
}
