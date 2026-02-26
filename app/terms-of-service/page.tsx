import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOW_POLICY_PAGES } from "@/lib/demo";

export default function TermsOfServicePage() {
  if (!SHOW_POLICY_PAGES) notFound();
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-5 text-sm text-slate-700">
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            kubolor.com and related services (the "Services") provided by
            OKWUJIAKU VALENTINE LLC ("Kubolor," "we," "us," or "our"). By using
            the Services, you agree to these Terms.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Eligibility and accounts
            </h2>
            <p>
              You must be legally able to enter a binding contract to use the
              Services. You are responsible for safeguarding your account and
              all activities under it.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Acceptable use
            </h2>
            <p>
              You agree not to misuse the Services, including attempting to
              access unauthorized systems, distribute malware, or violate any
              law or third-party rights.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Subscription and billing
            </h2>
            <p>
              Paid plans renew automatically until canceled. Fees are
              non-refundable except as described in our{" "}
              <Link
                href="/refund-policy"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Refund Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Content and intellectual property
            </h2>
            <p>
              You retain ownership of content you submit. You grant Kubolor a
              limited license to process, store, and display that content to
              provide the Services. Kubolor owns all platform software and
              related intellectual property.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Service availability
            </h2>
            <p>
              We strive to keep the Services available, but they may be
              interrupted for maintenance or unforeseen issues. We may update
              features at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Disclaimers
            </h2>
            <p>
              The Services are provided "as is" and "as available" without
              warranties of any kind. We do not guarantee specific outcomes,
              rankings, or results from using the Services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, Kubolor is not liable for
              indirect, incidental, special, or consequential damages arising
              from your use of the Services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Termination
            </h2>
            <p>
              You may cancel your account at any time. We may suspend or
              terminate access if you violate these Terms or use the Services
              in a harmful way.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Changes to these Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              Services after changes become effective means you accept the
              revised Terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Contact
            </h2>
            <p>
              Questions about these Terms? Reach us via{" "}
              <Link
                href="/support"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Live Chat Support
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
