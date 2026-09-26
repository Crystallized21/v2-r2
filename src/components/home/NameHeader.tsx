import Link from "next/link";

export default function NameHeader() {
  return (
    <Link
      href="/"
    >
      <h1 className="text-4xl text-foreground font-extralight font-stretch-200% mb-8 mt-4">
        Crystal&apos;s Spectra Vault
      </h1>
    </Link>
  )
}