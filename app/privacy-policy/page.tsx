import Link from "next/link";
import { notFound } from "next/navigation";
import { SHOW_POLICY_PAGES } from "@/lib/demo";

export default function PrivacyPolicyPage() {
  if (!SHOW_POLICY_PAGES) notFound();
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-5 text-sm text-slate-700">
          <p>
            This Privacy Policy explains how OKWUJIAKU VALENTINE LLC ("Kubolor,"
            "we," "us," or "our") collects, uses, shares, and protects personal
            information when you use kubolor.com and related services
            (collectively, the "Services").
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Information we collect
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Account information such as name, email address, and profile
                details you provide.
              </li>
              <li>
                Billing information needed to process payments, handled through
                trusted payment processors.
              </li>
              <li>
                Usage data like pages viewed, feature usage, and device details.
              </li>
              <li>
                Content you submit, upload, or generate through the Services.
              </li>
              <li>
                Communications you send to us, including support requests.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              How we use information
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide, operate, and improve the Services.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Respond to requests and provide support.</li>
              <li>Communicate product updates and important notices.</li>
              <li>Monitor for security, fraud prevention, and compliance.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Sharing of information
            </h2>
            <p>
              We do not sell your personal information. We may share information
              with service providers that help us operate the Services, comply
              with legal obligations, or protect our rights. When required, we
              will only share information in accordance with applicable laws.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Data retention
            </h2>
            <p>
              We retain personal information only as long as necessary to
              provide the Services, comply with legal obligations, resolve
              disputes, and enforce agreements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Your choices
            </h2>
            <p>
              You may update or delete your account information by accessing
              your account settings. You can also opt out of non-essential
              communications at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              International users
            </h2>
            <p>
              Kubolor operates globally. By using the Services, you understand
              that your information may be processed in countries where data
              protection laws may differ from those in your jurisdiction.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Contact us
            </h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
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
