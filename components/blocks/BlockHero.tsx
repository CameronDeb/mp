import Link from 'next/link';
import Image from 'next/image';
import type { BlockHeroData } from '@/lib/pages';

const bgMap: Record<string, string> = {
  navy:  'var(--color-brand-navy)',
  cream: 'var(--color-brand-cream)',
  white: '#ffffff',
};

function isExternal(url: string) {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * The secondary CTA used to be hardcoded to white text with a faint white
 * border regardless of the block's background, so on a cream hero it was
 * effectively invisible — the "too faint" secondary CTA in the V3 review.
 * It now follows the background, and `.btn-outline` draws its border from
 * `currentColor`, so the two can no longer drift apart.
 */
function CTA({
  label, url, primary, onDark,
}: { label: string; url: string; primary: boolean; onDark: boolean }) {
  const cls = primary ? 'btn btn-primary' : 'btn btn-outline';
  const style: React.CSSProperties =
    primary || !onDark ? {} : { color: '#ffffff' };

  if (isExternal(url)) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{label}</a>;
  }
  return <Link href={url} className={cls} style={style}>{label}</Link>;
}

export default function BlockHero({ block }: { block: BlockHeroData }) {
  const bg = bgMap[block.background ?? 'cream'] ?? bgMap.cream;
  const onDark = block.background === 'navy';

  return (
    <section
      id={block.anchor_id || undefined}
      className="section relative overflow-hidden"
      style={{ backgroundColor: bg, paddingTop: '8rem', paddingBottom: '6rem' }}
    >
      {/* Optional photo behind the hero, set per page in the CMS. The scrim is
          applied here rather than left to whoever picks the image, so a hero
          can never end up with unreadable text — and it means Mark can swap
          the photo himself without needing anyone to check contrast. */}
      {block.background_image && (
        <>
          {/* Dark heroes take the photo full-bleed and dimmed, since white type
              sits on top of it. Light heroes instead show it at full strength
              on the right and fade it out before the text: a washed-out image
              behind dark type would be neither readable nor worth looking at.
              Hidden below 900px, where there is no room beside the headline. */}
          <div
            className="hidden lg:block absolute inset-y-0 pointer-events-none"
            style={
              onDark
                ? { left: 0, right: 0 }
                : { right: 0, width: '58%', left: 'auto' }
            }
          >
            <Image
              src={block.background_image}
              alt=""
              fill
              priority
              sizes={onDark ? '100vw' : '58vw'}
              style={{ objectFit: 'cover', objectPosition: 'center', opacity: onDark ? 0.32 : 1 }}
            />
            {!onDark && (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, ${bg} 0%, ${bg} 12%, rgba(255,255,255,0) 78%)`,
                }}
              />
            )}
          </div>
          {onDark && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-brand-navy) 0%, rgba(41,54,67,0.9) 50%, rgba(41,54,67,0.55) 100%)',
              }}
            />
          )}
        </>
      )}
      {onDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 70% at 75% 50%, rgba(192,82,42,0.12) 0%, transparent 70%)' }}
        />
      )}
      <div className="container relative z-10 max-w-3xl">
        {block.eyebrow && (
          <>
            <div className="section-divider mb-4" />
            <span className="eyebrow">{block.eyebrow}</span>
          </>
        )}
        <h1
          className="mt-4 mb-6"
          style={{ color: onDark ? '#ffffff' : 'var(--color-brand-text)' }}
        >
          {block.heading}
        </h1>
        {block.body && block.body.split('\n\n').map((para, i) => (
          <p key={i} style={{
            fontSize: 'var(--text-lead)',
            color: onDark ? 'rgba(255,255,255,0.72)' : 'var(--color-brand-text-muted)',
            lineHeight: 1.75,
            maxWidth: '52ch',
            marginBottom: '1rem',
          }}>
            {para}
          </p>
        ))}
        {(block.cta_primary_label && block.cta_primary_url) || (block.cta_secondary_label && block.cta_secondary_url) ? (
          <div className="mt-10 flex flex-wrap gap-4">
            {block.cta_primary_label && block.cta_primary_url && (
              <CTA label={block.cta_primary_label} url={block.cta_primary_url} primary={true} onDark={onDark} />
            )}
            {block.cta_secondary_label && block.cta_secondary_url && (
              <CTA label={block.cta_secondary_label} url={block.cta_secondary_url} primary={false} onDark={onDark} />
            )}
          </div>
        ) : null}
        {block.quick_facts && block.quick_facts.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" style={{ listStyle: 'none', padding: 0 }}>
            {block.quick_facts.map((fact, i) => (
              <li key={i} style={{
                fontSize: 'var(--text-small)',
                fontWeight: 600,
                color: onDark ? 'rgba(255,255,255,0.72)' : 'var(--color-brand-text-muted)',
              }}>
                <span style={{ color: 'var(--color-brand-sienna)', marginRight: '0.5rem' }}>·</span>
                {fact.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
