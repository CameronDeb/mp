import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Disclaimer | Dr. Mark Pirtle',
  description:
    'The educational nature of the work published by Dr. Mark Pirtle and SkillfullyAware, and what it is not.',
};

export default function Disclaimer() {
  return (
    <LegalPage title="Disclaimer" updated="2 September 2026">
      <p>
        The work published here deals with stress, emotion, behaviour, and the patterns people
        repeat. That territory sits close to health, so it is worth being clear about what this
        material is and what it is not.
      </p>

      <h2>Educational, not clinical</h2>
      <p>
        The book, the workbooks, the guided audio, the assessments, the reflection tool, the
        blog, and the films are all educational. They describe ideas, research, and practices,
        and they are offered so you can think about your own experience more clearly.
      </p>
      <p>
        They are not medical advice, psychiatric or psychological treatment, psychotherapy,
        counselling, or a diagnosis. Reading this material, using the tools, or attending a
        session does not create a clinical or therapeutic relationship, and Dr. Pirtle is not
        acting as your physician or therapist.
      </p>

      <h2>Please keep your own professionals</h2>
      <p>
        Nothing here should replace advice from a doctor, therapist, or other qualified
        professional who knows your situation. Do not delay seeking help, disregard advice you
        have been given, or stop or change a prescribed treatment because of something you read
        or heard here. If you have a health concern, talk to a professional about it.
      </p>

      <h2>If you are in crisis</h2>
      <p>
        This site is not a crisis service and is not monitored for emergencies. If you are in
        immediate danger, or you may be at risk of harming yourself, contact your local
        emergency services now. In the United States you can call or text{' '}
        <strong>988</strong> to reach the Suicide and Crisis Lifeline, available 24 hours a day.
      </p>

      <h2>Individual results</h2>
      <p>
        People arrive with different histories, circumstances, and support. Stories, testimonials,
        and examples shared on this site describe what particular individuals experienced. They
        are not a promise or a prediction of what will happen for you, and no specific outcome is
        guaranteed.
      </p>

      <h2>The reflection tool</h2>
      <p>
        Why Did I React That Way is a reflective prompt, not an assessment or a screening
        instrument. It points you toward a chapter and a practice based on what you describe. It
        does not evaluate your mental health, and its output should not be treated as a finding
        about you.
      </p>

      <h2>Outside links and sources</h2>
      <p>
        This site references research, books, films, and other people&rsquo;s work. Those
        references are for interest and context. Linking to something is not an endorsement of
        everything its author has said, and external sites are not under our control.
      </p>

      <h2>Questions</h2>
      <p>
        If anything here is unclear, or you want to know whether a particular resource is right
        for your situation, email{' '}
        <a href="mailto:mark@skillfullyaware.com">mark@skillfullyaware.com</a> and ask. See also
        our <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
