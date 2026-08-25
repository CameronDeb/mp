'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';
import type { HomepageCopy } from '@/lib/homepage';

/** ~200 words per minute over the rendered text. */
function readTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function LatestBlogPosts({
  copy,
  posts,
}: {
  copy: HomepageCopy;
  posts: BlogPost[];
}) {
  return (
    <section className="section" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12" style={{ gap: '1.5rem' }}>
          <div>
            <div className="section-divider mb-4" />
            <span className="eyebrow">{copy.blog_eyebrow}</span>
            <h2
              className="mt-4 mb-3"
              dangerouslySetInnerHTML={{ __html: copy.blog_heading }}
            />
            <p style={{ color: 'var(--color-brand-text-muted)', fontSize: 'var(--text-lead)', maxWidth: '48ch' }}>
              {copy.blog_body}
            </p>
          </div>

          <Link
            href={copy.blog_cta_url}
            className="inline-flex items-center gap-2 flex-shrink-0"
            style={{
              backgroundColor: 'var(--color-brand-navy)',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: 'var(--text-small)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase' as const,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap' as const,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-brand-navy-light)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-brand-navy)')}
          >
            {copy.blog_cta_label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{
                display: 'block',
                backgroundColor: '#ffffff',
                borderRadius: '0.625rem',
                overflow: 'hidden',
                border: '1px solid var(--color-brand-warm-gray)',
                boxShadow: 'var(--shadow-card)',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-premium)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* Post thumbnail. Every post carries a featured_image in
                  Directus; this slot used to render a flat off-white block and
                  ignore it. Falls back to that block when an image is absent. */}
              <div
                style={{
                  height: '11rem',
                  backgroundColor: 'var(--color-brand-off-white)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1rem',
                  overflow: 'hidden',
                }}
              >
                {post.featured_image && (
                  <>
                    <Image
                      src={post.featured_image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    {/* Scrim so the category pill stays legible on any image. */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 45%, transparent 70%)',
                      }}
                    />
                  </>
                )}
                <span
                  style={{
                    position: 'relative',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    color: 'var(--color-brand-sienna)',
                    backgroundColor: post.featured_image ? 'rgba(255,255,255,0.92)' : 'rgba(192,82,42,0.1)',
                    border: '1px solid rgba(192,82,42,0.2)',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '9999px',
                  }}
                >
                  {post.categories[0] ?? 'Essay'}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    marginBottom: '0.75rem',
                    fontSize: 'var(--text-xs)', color: 'var(--color-brand-text-light)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {post.published_date
                      ? new Date(post.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock className="w-3.5 h-3.5" />
                    {readTime(post.content)}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.1rem', fontWeight: 700,
                  color: 'var(--color-brand-text)',
                  marginBottom: '0.625rem', lineHeight: 1.35,
                }}>
                  {post.title}
                </h3>

                <p style={{
                  fontSize: 'var(--text-small)',
                  color: 'var(--color-brand-text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                  maxWidth: 'none',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}>
                  {post.excerpt}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  fontSize: 'var(--text-small)', fontWeight: 600,
                  color: 'var(--color-brand-sienna)',
                }}>
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}