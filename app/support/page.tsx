import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Support
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Live Chat Support
          </h1>
          <p className="text-sm text-slate-600">
            We typically respond within 1 business day.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-700">
          <p>
            Need help with Kubolor? Start a chat and our team will respond as
            quickly as possible. You can also explore the{" "}
            <Link
              href="/blog"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              blog
            </Link>{" "}
            for guides and updates.
          </p>
          <p>
            For urgent billing or account issues, include your account email and
            the invoice or payment reference.
          </p>
        </div>
      </div>
    </main>
  );
}
