import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service | Dr. Mark Pirtle',
  description:
    'The terms that apply when you use drmarkpirtle.com or buy digital products from SkillfullyAware.',
};

export default function TermsOfService() {
  return (
    <LegalPage title="Terms of Service" updated="2 September 2026">
      <p>
        These terms apply when you use drmarkpirtle.com or whydidireactthatway.com, or buy
        anything from them. Both sites are operated by Dr. Mark Pirtle under the SkillfullyAware
        name. Using the sites means you accept these terms.
      </p>

      <h2>This is education, not treatment</h2>
      <p>
        Everything published here, including the book, the workbooks, the guided audio, the
        assessments, and the reflection tool, is educational. It is not medical advice, mental
        health treatment, psychotherapy, or a diagnosis, and using this site does not create a
        clinical or therapeutic relationship.
      </p>
      <p>
        It is not a substitute for care from a qualified professional. If you are struggling
        with your mental or physical health, please speak to a doctor or licensed clinician. If
        you are in crisis or may be at risk of harming yourself, contact your local emergency
        services or a crisis line immediately. In the United States you can call or text 988 to
        reach the Suicide and Crisis Lifeline.
      </p>

      <h2>Buying digital products</h2>
      <p>
        Payments are handled by Stripe. Prices are shown in US dollars and are payable at the
        time of purchase. Once a payment succeeds you receive a link to download what you
        bought. Download links are personal to you and expire after a period of time, but you
        can request a fresh link at any point by getting in touch.
      </p>
      <p>
        What you buy is licensed to you for your own personal use. You may keep your copy, print
        it, and use it yourself. You may not resell it, republish it, share the files publicly,
        upload them elsewhere, or distribute them to a group or organization without written
        permission. If you would like to use something with a team, a class, or a client group,
        that is usually possible, so please ask.
      </p>

      <h2>Refunds</h2>
      <p>
        If something you bought does not download, does not work, or is not what was described,
        email <a href="mailto:mark@skillfullyaware.com">mark@skillfullyaware.com</a> within 30
        days of purchase and it will be put right or refunded.
      </p>

      <h2>Sessions, retreats, and consulting</h2>
      <p>
        Calls, assessments, retreats, and consulting engagements are arranged separately and are
        subject to whatever is agreed in writing at the time, including any scheduling and
        cancellation terms. Where those arrangements differ from this page, the written
        agreement applies.
      </p>

      <h2>Ownership</h2>
      <p>
        The writing, images, audio, assessments, and design on these sites belong to Dr. Mark
        Pirtle unless stated otherwise. SkillfullyAware is a registered trademark. You are
        welcome to quote short passages with attribution and a link. Reproducing substantial
        parts, or using this material commercially, requires permission.
      </p>

      <h2>Your account and conduct</h2>
      <p>
        Please do not attempt to break, overload, or gain unauthorized access to the sites, and
        do not use them to send anything unlawful or abusive. Access may be withdrawn if these
        terms are broken.
      </p>

      <h2>Links to other sites</h2>
      <p>
        These sites link to third parties, including a publisher, a booking tool, and payment
        pages. Those services have their own terms and privacy policies, and are not controlled
        from here.
      </p>

      <h2>Availability</h2>
      <p>
        The sites are provided as they are. Every reasonable effort is made to keep them
        available, accurate, and working, but they are not guaranteed to be uninterrupted or
        error free, and they may change or be taken down at any time.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, Dr. Mark Pirtle and SkillfullyAware are not liable for
        indirect or consequential losses arising from your use of these sites or the materials
        on them. Nothing here limits liability where it cannot lawfully be limited. Decisions
        you make about your health, your work, and your relationships remain yours.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Arizona, United States.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated from time to time. The date at the top of this page shows
        when they last changed, and continuing to use the sites means accepting the current
        version.
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
