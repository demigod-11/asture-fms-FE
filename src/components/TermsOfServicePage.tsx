import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-card border border-gray-200/60 dark:border-gray-700'>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
          Terms of Service
        </h1>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
          Effective: 1st July 2026
        </p>

        <div className='mt-6 space-y-5 text-sm text-gray-700 dark:text-gray-200 leading-6'>
          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Introduction & Agreement
            </h2>
            <p className='mt-1'>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
              and use of the Asture Financial Management System (the
              &ldquo;Service&rdquo;). The Service is operated by Asture
              Financial Management System, a subsidiary of First Guide
              Management LTD (&ldquo;Asture&rdquo;, &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, &ldquo;our&rdquo;). By creating an account,
              accessing, or using the Service, you agree to these Terms.
            </p>
            <p className='mt-2'>
              If you use the Service on behalf of an organisation, you represent
              that you have authority to bind that organisation, and
              &ldquo;you&rdquo; includes the organisation and its authorised
              users.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Eligibility & Accounts
            </h2>
            <p className='mt-1'>
              You must be able to enter into a binding contract to use the
              Service. You are responsible for maintaining the confidentiality
              of your account credentials and for all activity under your
              account (including activity by your authorised users).
            </p>
            <p className='mt-2'>
              Notify us promptly if you suspect unauthorised access or misuse of
              your account.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              The Service
            </h2>
            <p className='mt-1'>
              The Service provides financial management tools and related
              features. We may update, change, suspend, or discontinue parts of
              the Service from time to time, including during MVP and
              preview/beta periods.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Your Content & Data
            </h2>
            <p className='mt-1'>
              &ldquo;Customer Content&rdquo; means the data, documents, and
              information you upload to or generate within the Service. You
              retain ownership of your Customer Content.
            </p>
            <p className='mt-2'>
              You grant Asture a limited licence to host, store, process,
              transmit, and display Customer Content only as needed to operate,
              secure, and improve the Service, provide support, and comply with
              legal obligations.
            </p>
            <p className='mt-2'>
              You are responsible for ensuring you have all required rights and
              permissions to upload Customer Content, including personal data of
              others where applicable.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Acceptable Use
            </h2>
            <p className='mt-1'>
              You agree not to misuse the Service. You must not use the Service
              unlawfully, attempt unauthorised access, disrupt the Service,
              upload malware, or reverse engineer the Service except where
              permitted by law.
            </p>
            <p className='mt-2'>
              We may suspend or terminate access if we reasonably believe your
              use violates these Terms or creates risk to other users, the
              Service, or Asture.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              MVP Billing, Trials & Future Subscriptions
            </h2>
            <p className='mt-1'>
              During MVP, the Service is provided as a free trial. If/when paid
              plans are introduced, subscriptions may be offered on quarterly
              and yearly billing cycles. Pricing, plan details, and any payment
              terms will be presented at the time paid plans launch and may form
              part of these Terms (or supplementary plan terms).
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Data Deletion & Retention
            </h2>
            <p className='mt-1'>
              If you delete your organisation (or request deletion), we will
              retain your organisation data for 7 days after deletion to support
              recovery and orderly shutdown. During this retention window, you
              may choose to export or migrate your data.
            </p>
            <p className='mt-2'>
              After the retention window, we may permanently delete the data
              unless we are required to retain it longer for legal, security, or
              compliance reasons.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Third-Party Services & Integrations
            </h2>
            <p className='mt-1'>
              The Service may integrate with third-party services. Third-party
              services are governed by their own terms and privacy policies. We
              are not responsible for third-party services, their availability,
              or their actions.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Intellectual Property
            </h2>
            <p className='mt-1'>
              The Service, including its software, design, and underlying
              technology, is owned by Asture and/or its licensors. These Terms
              grant you a limited right to use the Service, not ownership.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Feedback
            </h2>
            <p className='mt-1'>
              If you submit feedback or suggestions, you grant Asture the right
              to use them without restriction or compensation, including to
              improve the Service.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Disclaimers
            </h2>
            <p className='mt-1'>
              To the fullest extent permitted by law, the Service is provided
              &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. We do not
              guarantee uninterrupted or error-free operation.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Limitation of Liability
            </h2>
            <p className='mt-1'>
              To the fullest extent permitted by law, we are not liable for
              indirect, incidental, special, consequential, or punitive damages.
              Our total liability for claims relating to the Service is limited
              to the amount you paid to us for the Service in the 12 months
              before the event giving rise to the claim (and during MVP free
              trial, this may be &pound;0).
            </p>
            <p className='mt-2'>
              Nothing in these Terms limits liability that cannot be excluded
              under applicable law.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Termination
            </h2>
            <p className='mt-1'>
              You may stop using the Service at any time. We may suspend or
              terminate access if you breach these Terms or if necessary to
              protect the Service, users, or Asture.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Governing Law
            </h2>
            <p className='mt-1'>
              These Terms are governed by the laws of [England and Wales].
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Dispute Resolution (Arbitration)
            </h2>
            <p className='mt-1'>
              If a dispute arises out of or relating to these Terms or the
              Service, you and Asture agree to try to resolve it informally
              first. If it cannot be resolved, the dispute will be resolved by
              binding arbitration rather than in court, except where applicable
              law requires otherwise.
            </p>
            <ul className='mt-2 list-disc pl-5 space-y-1'>
              <li>Arbitration seat (location): [London, United Kingdom]</li>
              <li>Arbitration provider/rules: [To be specified]</li>
              <li>Language: English</li>
            </ul>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Changes to These Terms
            </h2>
            <p className='mt-1'>
              We may update these Terms from time to time. Continued use of the
              Service after changes become effective constitutes acceptance of
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              Contact
            </h2>
            <p className='mt-1'>
              For questions about these Terms, contact{' '}
              <a className='underline' href='mailto:legal@firstguide.co.uk'>
                legal@firstguide.co.uk
              </a>{' '}
              /{' '}
              <a className='underline' href='mailto:support@firstguide.co.uk'>
                support@firstguide.co.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
