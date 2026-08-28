# Newsletter send runbook

## Why the list needs warming up

1,583 contacts, dormant since the Squarespace era, and `mg.drmarkpirtle.com`
has sent roughly four emails in its life. A domain with no sending history that
suddenly mails 1,583 dormant people is the textbook spam-filter trigger.

The blast radius matters: complaints damage sender reputation, and Mark's
transactional mail for the reflection tool and SAAQ also depends on his domains
staying clean. Go slow the first time. After one successful full send the
reputation exists and later sends can go out in one pass.

## Before the first real send

- [ ] `NEWSLETTER_PHYSICAL_ADDRESS` set in Vercel (the send route refuses
      otherwise — see `physicalAddressProblem()` in `lib/newsletter-render.ts`)
- [ ] Mailgun domain unsubscribe tracking **on** (otherwise `%unsubscribe_url%`
      is never substituted and the opt-out link is dead)
- [ ] Send yourself a test and click the unsubscribe link
- [ ] Mark has written a real newsletter in Directus, status `draft`

## Test send

Touches nothing in Directus and never marks the newsletter as sent.

```bash
curl -X POST https://drmarkpirtle.com/api/send-newsletter -H "Content-Type: application/json" -H "x-api-secret: $NEWSLETTER_API_SECRET" -d '{"newsletter_id":ID,"test_email":"you@example.com"}'
```

## Dry run

Resolves exactly who would receive the cohort. Sends nothing, writes nothing.

```bash
curl -X POST https://drmarkpirtle.com/api/send-newsletter -H "Content-Type: application/json" -H "x-api-secret: $NEWSLETTER_API_SECRET" -d '{"newsletter_id":ID,"batch_size":50,"after_id":0,"dry_run":true}'
```

## The warm-up

Recipients are ordered by subscriber `id` and paged with an `after_id` cursor,
not offsets. New signups always get higher ids, so they queue after the cursor
instead of shifting rows into or out of cohorts that already went out. Offset
paging would silently skip or double-send people whenever the list changed
mid-warm-up, which over four days it will.

Each response returns `nextAfterId`. Pass it as `after_id` on the next day.

Plan used for the first send (29 Aug 2026). The opening batch is 250 rather
than a token 50: Mark is promoting the book the same morning and needs the send
to have actually happened, and 250 is enough volume to produce meaningful
complaint data within hours while still holding 84% of the list back if
something goes wrong.

| Day | batch_size | after_id | Sends | Remaining |
|-----|-----------|----------|-------|-----------|
| 1 | 250 | 0 | 250 | 1333 |
| 2 | 400 | *day 1 `nextAfterId`* | 400 | 933 |
| 3 | 500 | *day 2 `nextAfterId`* | 500 | 433 |
| 4 | *omit* | *day 3 `nextAfterId`* | 433 | 0 |

```bash
curl -X POST https://drmarkpirtle.com/api/send-newsletter -H "Content-Type: application/json" -H "x-api-secret: $NEWSLETTER_API_SECRET" -d '{"newsletter_id":ID,"batch_size":50,"after_id":0}'
```

Omitting `batch_size` sends to everyone remaining, which is also the original
whole-list behaviour when `after_id` is 0.

The newsletter stays `status: sending` until the final cohort clears, then flips
to `sent`. `recipient_count` accumulates across cohorts. A half-finished send is
therefore never recorded as complete.

## Between each day, check

```bash
curl -s -u "api:$MAILGUN_API_KEY" "https://api.mailgun.net/v3/mg.drmarkpirtle.com/stats/total?event=delivered&event=failed&event=complained&duration=7d"
```

**Stop and reassess if:**

- complaints exceed **0.1%** of delivered (roughly 1 per 1,000) — this is
  Gmail's stated threshold
- hard bounces exceed **3%**
- delivered/accepted drops sharply, which usually means an ESP started blocking

Bounces and complaints auto-suppress at the domain level, so a stopped send
leaves no cleanup.

## Gotchas

- **From must stay on `mg.drmarkpirtle.com`.** Mailgun signs DKIM as that domain
  and uses it as the envelope sender. A From on `skillfullyaware.com` fails both
  SPF and DKIM alignment, so every message DMARC-fails. `NEWSLETTER_REPLY_TO`
  keeps replies reaching Mark.
- **Directus images must stay publicly readable.** Mail clients fetch images
  unauthenticated. The public policy allows read on `directus_files` except the
  "Paid Products (private)" folder — paid audio and workbook PDFs go in there,
  and better still, not in Directus at all.
- The send reads subscribers live from Directus, not a Mailgun mailing list, so
  the account's list member cap does not limit reach.
