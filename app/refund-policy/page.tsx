import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOW_POLICY_PAGES } from "@/lib/demo";

export default function RefundPolicyPage() {
  if (!SHOW_POLICY_PAGES) notFound();
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Refund Policy</h1>
          <p className="text-sm text-slate-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-5 text-sm text-slate-700">
          <p>
            This Refund Policy applies to payments made to OKWUJIAKU VALENTINE
            LLC ("Kubolor," "we," "us," or "our") for access to kubolor.com and
            related Services.
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Subscription refunds
            </h2>
            <p>
              If you are not satisfied, you may request a refund within 7 days
              of your first paid subscription purchase. After the 7-day period,
              subscription fees are non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Cancellation
            </h2>
            <p>
              You can cancel your subscription at any time. Your access will
              remain active through the end of the current billing period.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Non-refundable items
            </h2>
            <p>
              One-time fees, usage-based charges, and add-on services are
              non-refundable unless required by law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              How to request a refund
            </h2>
            <p>
              Please contact our support team with your account email and
              payment details. Approved refunds will be processed to the
              original payment method.
            </p>
            <p>
              Reach us via{" "}
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
