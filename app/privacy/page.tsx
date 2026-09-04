import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dr. Mark Pirtle',
  description:
    'How Dr. Mark Pirtle and SkillfullyAware collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Privacy Policy" updated="2 September 2026">
      <p>
        This policy explains what information this website collects, why it is collected, and
        what is done with it. It covers drmarkpirtle.com and whydidireactthatway.com, both
        operated by Dr. Mark Pirtle under the SkillfullyAware name.
      </p>

      <h2>The short version</h2>
      <p>
        Information is only collected when you choose to give it, by filling in a form,
        subscribing to the newsletter, or buying something. It is used to do the thing you
        asked for. It is never sold, rented, or shared with anyone for their own marketing, and
        there are no advertising trackers on this site.
      </p>

      <h2>What is collected, and when</h2>
      <p>
        <strong>Newsletter.</strong> Your name and email address, so the newsletter can be sent
        to you and addressed properly.
      </p>
      <p>
        <strong>Contact form.</strong> Your name, email address, and message, plus optionally
        your company and the reason you are getting in touch. The page you contacted from is
        recorded so enquiries can be answered in context.
      </p>
      <p>
        <strong>Launch team signup.</strong> Your first name and email address, and optionally
        your company, how you heard about the book, and whether you are willing to share it.
      </p>
      <p>
        <strong>Forum and retreat enquiries.</strong> Your name, email address, and optionally
        phone number, company, forum or organization, group size, budget range, and any notes
        you add, so a proposal can be prepared.
      </p>
      <p>
        <strong>Interest lists.</strong> Your name and email address, and optionally your
        company, so you can be told when something becomes available.
      </p>
      <p>
        <strong>Purchases.</strong> Payments are processed by Stripe. Card details are entered
        on Stripe&rsquo;s systems and are never seen or stored here. What is kept is a record of
        what you bought and the email address the purchase is tied to, so your download links
        keep working.
      </p>
      <p>
        <strong>The reflection tool.</strong> If you use Why Did I React That Way, and only if
        you tick the box asking for follow-up notes, your first name and email address are kept
        along with the chapter your reflection was matched to, its themes, and the practice
        suggested to you.{' '}
        <strong>The reflection you write is not stored at any point.</strong> It is used to
        produce your result and then discarded.
      </p>

      <h2>Visitor numbers</h2>
      <p>
        This site counts page views using Vercel Analytics, so it is possible to see which
        pages people find useful. It records the page visited and rough details like country
        and device type. It does not use cookies, does not follow you to other websites, and
        does not build a profile of you. The counts are not linked to your name or email
        address, and are not used for advertising.
      </p>

      <h2>What is not done</h2>
      <ul>
        <li>No advertising trackers or advertising cookies run on this site.</li>
        <li>No profile of your browsing is built, and you are not followed across the web.</li>
        <li>Your information is never sold, rented, or traded.</li>
        <li>Your details are never passed to anyone else for their own marketing.</li>
      </ul>

      <h2>Companies that help run the site</h2>
      <p>
        A small number of service providers process data on our behalf, and only in order to
        provide their service:
      </p>
      <ul>
        <li>
          <strong>Mailgun</strong> and <strong>Resend</strong>, to deliver email.
        </li>
        <li>
          <strong>Stripe</strong>, to process payments.
        </li>
        <li>
          <strong>Vercel</strong> and <strong>DigitalOcean</strong>, to host the site, its
          content, and downloadable files.
        </li>
        <li>
          <strong>Supabase</strong>, to store reflection tool results for people who asked for
          follow-up notes.
        </li>
      </ul>

      <h2>Email you receive</h2>
      <p>
        The newsletter goes only to people who asked for it. Every issue includes an unsubscribe
        link at the bottom and supports one-click unsubscribe in email clients that offer it.
        Unsubscribing takes effect immediately, and the address is suppressed so it cannot be
        mailed again by mistake.
      </p>
      <p>
        Emails sent in response to something you did, such as a purchase receipt or a download
        link, are separate from the newsletter and are sent whether or not you subscribe.
      </p>

      <h2>How long information is kept</h2>
      <p>
        Newsletter subscriptions are kept until you unsubscribe. Purchase records are kept as
        long as needed to support your access to what you bought and to meet tax and accounting
        obligations. Enquiries are kept while the conversation is useful and then removed.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask what information is held about you, ask for it to be corrected, or ask for
        it to be deleted. Email{' '}
        <a href="mailto:mark@skillfullyaware.com">mark@skillfullyaware.com</a> and it will be
        handled. Deleting your information may mean losing access to files you purchased, so
        that will be confirmed with you first.
      </p>

      <h2>Children</h2>
      <p>
        This site is intended for adults and is not directed at children under 13. Information
        is not knowingly collected from them.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top of this page will change with it. Material
        changes affecting how your information is used will be described in the newsletter.
      </p>

      <h2>Contact</h2>
      <p>
        Dr. Mark Pirtle
        <br />
        2506 E Drachman St, Tucson, AZ 85716
        <br />
        <a href="mailto:mark@skillfullyaware.com">mark@skillfullyaware.com</a>
      </p>
    </LegalPage>
  );
}
