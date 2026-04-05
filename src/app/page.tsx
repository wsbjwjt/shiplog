import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] text-white">
      <main className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          ShipLog
        </h1>
        <p className="mb-8 max-w-md text-xl text-gray-400">
          Beautiful changelogs for your products. Share updates with your users.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-md bg-[#58a6ff] px-6 py-3 font-medium text-white hover:bg-blue-600"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/wsbjwjt/shiplog"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#30363d] bg-[#21262d] px-6 py-3 font-medium text-white hover:bg-[#30363d]"
          >
            View on GitHub
          </a>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-gray-500">
        Built with Next.js + Prisma + NextAuth
      </footer>
    </div>
  );
}
