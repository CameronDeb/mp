'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Check, Plus, Minus, Users, Clock, MapPin } from 'lucide-react';
import { ForumRetreatInquirySection } from '@/components/forum-retreats/ForumRetreatInquirySection';

// ─── DATA ────────────────────────────────────────────────────────────────────

const coreElements = [
  'Custom planning call with Dr. Pirtle',
  'Pre-retreat questionnaire and/or SAAQ intake, depending on retreat design',
  'SAAQ assessment and private participant reports, when included in the retreat design',
  'Facilitated group dialogue and coaching circles',
  'Guided reflection, pattern work, and leadership exercises',
  'Meditation, awareness, and SkillfullyAware® practices',
  'Belief Audit, Pattern Work and Parts Dialogue, Narrative Flip, or other practices selected for the group',
  'Shared language and practical next steps for post-retreat integration',
  'Post-retreat integration guide',
];

const venueElements = [
  'Private accommodations or lodging coordination',
  'Meals, snacks, and non-alcoholic beverages',
  'Nature walks, desert reflection, or equivalent location-based practices',
  'Evening fire circle or equivalent closing experience',
  'Nordic sauna, wellness amenities, or nature access when available',
  'Music, drumming, or live music when appropriate for the group',
  'Outdoor excursions based on location and schedule',
  'Equine-assisted leadership when the venue and facilitator team support it',
  'Bodywork or somatic sessions by arrangement',
  'Guest facilitators by request',
];

const tensions = [
  {
    title: 'The identity pressure.',
    body: "When work carries your name, your reputation, or decades of sacrifice, the role can become difficult to separate from the person. Dr. Pirtle's retreats create space to examine that honestly and carefully.",
  },
  {
    title: 'The isolation problem.',
    body: "At a certain level, honest feedback becomes harder to find. People tell you what they think you want to hear, or they say nothing at all. The SAAQ can provide a structured mirror before the retreat; a well-held forum retreat creates the conditions where honest peer input can actually be spoken, heard, and used.",
  },
  {
    title: 'The pattern problem.',
    body: "Every leader has patterns that show up under pressure — over-control, avoidance, defensiveness, people-pleasing, conflict, shutdown, urgency, or self-protection. The SAAQ can help name these patterns; SkillfullyAware® practices help people work with them more skillfully.",
  },
  {
    title: 'The deeper question.',
    body: "Is this still the way I want to lead, relate, and live? Dr. Pirtle's retreats create the space to ask that question with enough honesty, safety, and support to let something useful emerge.",
  },
];

const steps = [
  { n: '01', title: 'Tell us about your group', body: 'Fill out a short inquiry form. No commitment — just enough context to begin shaping the right conversation.' },
  { n: '02', title: 'Planning call with Dr. Pirtle', body: 'Mark personally connects with you to understand your forum, your goals, the group dynamic, and what kind of retreat or SAAQ immersion would serve you best.' },
  { n: '03', title: 'Your custom proposal', body: 'You receive a tailored proposal with recommended format, itinerary or immersion design, experiences, logistics, and pricing.' },
  { n: '04', title: 'Lock it in', body: 'Sign the agreement and place your deposit. We handle the planning details from there.' },
  { n: '05', title: 'Show up', body: 'Arrive at Tubac Ranch, your selected private retreat setting, or the agreed SAAQ immersion location for a focused experience with no unnecessary distractions.' },
  { n: '06', title: 'Leave with shared language and next steps', body: 'Your forum leaves with clearer trust, practical tools, and a shared experience you can keep building on.' },
];

const formats = [
  {
    label: 'Private Forum Retreats',
    price: '$3,000–$6,000 per person',
    duration: '2–5 day private retreats',
    body: 'Custom-designed experiences for EO/YPO forums, founders, and leadership groups. May include facilitated dialogue, SkillfullyAware® practices, leadership reflection, pattern work, nature-based experiences, shared meals, integration planning, and venue-specific amenities.',
    note: 'Signature retreats at Tubac Ranch, Arizona. Custom private locations available by request.',
    popular: false,
  },
  {
    label: 'SAAQ Forum Immersion',
    price: 'Starting at $12,500 per forum',
    duration: 'One-day / six-hour intensive',
    body: 'A premium developmental experience built around the SkillfullyAware Awareness Quotient. Participants complete the SAAQ and receive private developmental reports before a facilitated six-hour immersion. Groups leave with a 90-day practice and accountability plan.',
    note: 'Generally includes up to 8 participants.',
    popular: true,
  },
  {
    label: 'Premium SAAQ Forum Immersion',
    price: 'From $18,000',
    duration: 'Custom premium engagement',
    body: 'For forums wanting deeper individual attention. May include individual pre-immersion debriefs, a more customized group summary, additional follow-up coaching calls, and more hands-on 90-day integration support.',
    note: 'Custom pricing based on scope and participation.',
    popular: false,
  },
];

const credibilityPoints = [
  'Private, carefully held space for conversations that rarely happen in regular meetings',
  "A retreat process designed around the group's actual needs",
  'SkillfullyAware® tools for trust, self-awareness, pattern recognition, and practical integration',
  'A setting that supports depth without unnecessary performance, pressure, or spectacle',
];

const faqs = [
  { q: 'Is this only for EO or YPO forums?', a: 'No. The retreat is designed for EO/YPO forums, but it can also serve founders, executive teams, leadership groups, and private peer groups that want a deeper, well-held experience.' },
  { q: 'Can we customize the experiences?', a: "Yes. Every retreat is shaped around your group's goals, timing, needs, and level of readiness. The inquiry and planning call help determine what belongs in the retreat and what does not." },
  { q: 'How far in advance should we book?', a: 'Earlier is better, especially for multi-day retreats and full property buyouts. If your dates are flexible, we can usually explore several options.' },
  { q: 'What does "full private buyout" mean?', a: "At Tubac Ranch, a full private buyout means your group has private use of the retreat setting during your stay, with no outside guests, shared programming, or competing events. For custom locations, we help identify or work with a private setting that provides the right level of privacy, comfort, and focus for your group." },
  { q: 'How is pricing structured?', a: 'Private multi-day forum retreats are priced at $3,000–$6,000 per person, depending on length, location, group size, customization, and retreat design. SAAQ Forum Immersions start at $12,500 per forum for a one-day / six-hour intensive. Premium SAAQ engagements begin at $18,000. Additional participants, individual debriefs, travel, lodging, meals, venue costs, and follow-up support may be quoted separately.' },
  { q: 'What if someone in the group has specific needs?', a: 'We discuss participant needs during planning and do our best to accommodate dietary, physical, emotional, and logistical considerations.' },
  { q: 'What happens after the retreat?', a: 'Groups receive integration guidance so the retreat does not end when people leave the property. Follow-up coaching or additional support can be added when useful.' },
  { q: 'Is plant medicine an optional experience?', a: 'Plant medicine is not part of any standard retreat package and is not included automatically. Any specialty experience would require a separate private conversation, safety review, location review, and group-fit assessment.' },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--color-brand-sienna)', marginBottom: '0.75rem',
    }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div className="section-divider mb-4" />;
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {faqs.map((f, i) => (
        <div key={i} className="accordion-item">
          <button className="accordion-trigger" onClick={() => setOpen(open === i ? null : i)}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 600 }}>{f.q}</span>
            <span className="accordion-icon">
              {open === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </span>
          </button>
          {open === i && (
            <p style={{ marginTop: '0.75rem', color: 'var(--color-brand-text-muted)', lineHeight: 1.75, maxWidth: '72ch' }}>
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ForumRetreatsContent() {
  return (
    <div style={{ backgroundColor: 'var(--color-brand-cream)' }}>

      {/* ── HERO ──
          A photograph of Mark actually facilitating a group sits behind the
          gradient. The page was a wall of text about a room nobody could
          picture; this shows the room. The scrim is heavy enough that the
          headline keeps its contrast rather than competing with the image. */}
      <section style={{
        position: 'relative',
        minHeight: '85vh', display: 'flex', alignItems: 'center',
        padding: '8rem 1.5rem 6rem',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/mark/forum-retreats.webp"
          alt="Dr. Mark Pirtle facilitating a forum retreat session"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: '60% center' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background:
            'linear-gradient(135deg, rgba(20,20,20,0.93) 0%, rgba(45,32,32,0.86) 45%, rgba(20,20,20,0.78) 100%)',
        }} />
        <div className="container" style={{ maxWidth: 820, position: 'relative' }}>
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--color-brand-sienna)', marginBottom: '1.5rem',
          }}>
            Private Forum Retreats · EO/YPO · Tubac Ranch or Custom Private Locations
          </p>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '1.75rem',
          }}>
            A private retreat for the conversations<br />
            <em style={{ color: 'var(--color-brand-sienna)', fontStyle: 'normal' }}>
              your forum rarely gets to have.
            </em>
          </h1>
          <p style={{
            fontSize: 'var(--text-lead)', color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.75, maxWidth: '56ch', marginBottom: '0.75rem',
          }}>
            Custom SkillfullyAware® retreats for EO/YPO forums, founders, and leadership groups — designed for deeper trust, clearer self-awareness, better conversations, and practical growth.
          </p>
          <p style={{
            fontSize: 'var(--text-lead)', color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75, maxWidth: '56ch', marginBottom: '2.5rem',
          }}>
            You choose the dates. We help shape the experience, hold the process, and handle the details.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="#inquiry" className="btn-primary">
              Plan Your Forum Retreat <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="#formats" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2rem', border: '2px solid rgba(255,255,255,0.35)',
              borderRadius: '9999px', color: 'rgba(255,255,255,0.8)',
              fontSize: 'var(--text-small)', fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              Explore Retreat Experiences
            </Link>
          </div>
          {/* Stats strip */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[
              { icon: Users, label: '6–15 Participants' },
              { icon: Clock, label: 'One-day SAAQ or 2–5 day retreats' },
              { icon: MapPin, label: 'Tubac Ranch, AZ · Custom locations available' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-small)' }}>
                <Icon className="w-4 h-4" style={{ color: 'var(--color-brand-sienna)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOOK ── */}
      <section style={{ backgroundColor: '#ffffff', padding: '5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)', color: 'var(--color-brand-text)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Your forum is not looking for another keynote, team-building activity, or beautiful property with a loose agenda.
          </p>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--color-brand-text-muted)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            You are looking for a setting where people can be themselves, speak honestly, listen to each other, and do meaningful work together.
          </p>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--color-brand-text-muted)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
            Each retreat is designed around your forum's actual needs — deeper trust, leadership clarity, pattern work, conflict repair, transition, burnout, or renewed connection.
          </p>
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'var(--color-brand-text)', lineHeight: 1.85, fontWeight: 600 }}>
            Tubac Ranch is the signature Arizona retreat setting. Retreats can also be designed for your forum's preferred destination or another carefully chosen private location.
          </p>
        </div>
      </section>

      {/* ── WHAT THIS IS ── */}
      <section className="section" style={{ backgroundColor: 'var(--color-brand-off-white)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <Divider />
          <Eyebrow>The Retreat</Eyebrow>
          <h2 style={{ marginBottom: '2rem' }}>Designed for the Person Behind the Title</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              'At Tubac Ranch or another carefully chosen private setting, Dr. Mark Pirtle creates fully private retreat experiences built around one question: what does this forum actually need right now?',
              'The work is practical, personal, and carefully held. Depending on the group, the retreat may include the SAAQ, a shorter participant questionnaire, or both. When the SAAQ is included, each participant receives a private developmental reflection before the retreat, giving the forum a deeper map of strengths, blind spots, stress reactions, growth edges, and practical next steps.',
              'Participants leave with more than a shared memory. They leave with clearer trust, a stronger shared language, and practical insight into the patterns shaping how they lead, relate, decide, and respond under pressure.',
            ].map((t, i) => (
              <p key={i} style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT LEADERS CARRY ── */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Divider />
            <Eyebrow>Why It Matters</Eyebrow>
            <h2>What high-responsibility people rarely get to say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {tensions.map((t, i) => (
              <div key={i} className="card" style={{ padding: '2rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', marginBottom: '1.25rem',
                  backgroundColor: 'rgba(192,82,42,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: 'var(--color-brand-sienna)', fontWeight: 800, fontSize: '0.85rem' }}>0{i + 1}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-brand-text)' }}>{t.title}</h3>
                <p style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.75, fontSize: '0.95rem' }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="section" style={{ backgroundColor: 'var(--color-brand-navy)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-brand-sienna)', marginBottom: '0.75rem' }}>
              Every Retreat
            </p>
            <h2 style={{ color: '#ffffff' }}>What Each Retreat Can Include</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '60ch', margin: '1rem auto 0' }}>
              Every SkillfullyAware® retreat is custom-designed around the forum's goals, location, timing, and level of readiness. Some elements are core to the work. Others depend on the venue, selected format, and group context.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

            {/* Core Elements */}
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '2rem' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Core Elements
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>May be included in most retreat designs</p>
              {coreElements.map(item => (
                <div key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand-sienna)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Venue-Dependent Elements */}
            <div style={{ backgroundColor: 'rgba(192,82,42,0.08)', border: '1px solid rgba(192,82,42,0.25)', borderRadius: '0.75rem', padding: '2rem' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Venue & Context-Dependent
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Available depending on venue, format, and group context</p>
              {venueElements.map(item => (
                <div key={item} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Plus className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand-sienna)' }} />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ backgroundColor: 'var(--color-brand-off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Divider />
            <Eyebrow>The Process</Eyebrow>
            <h2>Simple for You. Powerful for Your Forum.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {steps.map(s => (
              <div key={s.n} style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '2rem', border: '1px solid var(--color-brand-warm-gray)' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-brand-warm-gray)', lineHeight: 1, marginBottom: '1rem', letterSpacing: '-0.04em' }}>{s.n}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-brand-text)' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-brand-text-muted)', lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RETREAT FORMATS ── */}
      <section id="formats" className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Divider />
            <Eyebrow>Retreat Options</Eyebrow>
            <h2>Choose the Format That Fits Your Forum</h2>
            <p style={{ color: 'var(--color-brand-text-muted)', maxWidth: '56ch', margin: '1rem auto 0', lineHeight: 1.7 }}>
              Every forum is different. Some groups want a private destination retreat with space for depth, restoration, and shared experience. Others want a focused SAAQ-based immersion that gives the group a clear developmental map and a practical 90-day plan.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: 1000, margin: '0 auto 2.5rem' }}>
            {formats.map(f => (
              <div key={f.label} style={{
                padding: '2rem', borderRadius: '0.75rem', position: 'relative',
                border: f.popular ? '2px solid var(--color-brand-sienna)' : '1px solid var(--color-brand-warm-gray)',
                backgroundColor: f.popular ? 'rgba(192,82,42,0.04)' : '#ffffff',
              }}>
                {f.popular && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: 'var(--color-brand-sienna)', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  }}>Popular</span>
                )}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-brand-text)' }}>{f.label}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-brand-sienna)', fontWeight: 700, marginBottom: '0.2rem' }}>{f.price}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-brand-text-muted)', marginBottom: '1rem' }}>{f.duration}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-brand-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>{f.body}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-brand-text-light)', fontStyle: 'italic' }}>{f.note}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: Users, text: '6–15 participants for private retreats' },
              { icon: Clock, text: 'SAAQ Immersion: up to 8 participants' },
              { icon: MapPin, text: 'Tubac Ranch, AZ · Custom locations available' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-brand-text-muted)', fontSize: 'var(--text-small)' }}>
                <Icon className="w-4 h-4" style={{ color: 'var(--color-brand-sienna)' }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DR. MARK ── */}
      <section className="section" style={{ backgroundColor: 'var(--color-brand-off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Photo placeholder */}
            <div style={{
              aspectRatio: '4/5', borderRadius: '0.75rem',
              backgroundColor: 'var(--color-brand-warm-gray)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              maxWidth: 420,
            }}>
              <p style={{ color: 'var(--color-brand-text-light)', fontSize: 'var(--text-small)' }}>Photo — Dr. Mark Pirtle</p>
            </div>
            <div>
              <Divider />
              <Eyebrow>Your Guide</Eyebrow>
              <h2 style={{ marginBottom: '1.5rem' }}>Dr. Mark Pirtle</h2>
              <p style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                Dr. Mark Pirtle has spent almost 30 years helping leaders, founders, forum members, and growth-minded people understand the patterns that shape how they lead, relate, decide, and respond under pressure.
              </p>
              <p style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                His SkillfullyAware® approach integrates mindfulness, neuroscience, developmental psychology, somatic awareness, shadow integration, and practical tools for working with patterns in real life.
              </p>
              <p style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Mark knows what it takes to hold a room where high-responsibility people can be honest without feeling exposed, challenged without being shamed, and connected without forcing vulnerability.
              </p>
              <Link href="/about" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-brand-sienna)', fontWeight: 700, fontSize: 'var(--text-small)', textDecoration: 'none', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Read Dr. Pirtle&apos;s Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY FORUMS CHOOSE THIS WORK ── */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <Divider />
          <Eyebrow>Why It Works</Eyebrow>
          <h2 style={{ marginBottom: '2rem' }}>Why Forums Choose This Work</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {credibilityPoints.map((point, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.25rem 1.5rem', backgroundColor: 'var(--color-brand-off-white)', borderRadius: '0.75rem', border: '1px solid var(--color-brand-warm-gray)' }}>
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand-sienna)' }} />
                <p style={{ color: 'var(--color-brand-text-muted)', lineHeight: 1.7, margin: 0 }}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ backgroundColor: 'var(--color-brand-off-white)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <Divider />
          <Eyebrow>Questions</Eyebrow>
          <h2 style={{ marginBottom: '2.5rem' }}>Frequently Asked</h2>
          <FAQ />
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <ForumRetreatInquirySection
        anchorId="inquiry"
        heading="Give your forum more than another good trip."
        intro="Create a private, carefully held retreat that helps your group deepen trust, see patterns more clearly, and leave with language and practices you can keep using."
      />

    </div>
  );
}
