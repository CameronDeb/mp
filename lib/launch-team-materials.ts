// What Built This Way Launch Team members receive.
//
// Names are Mark's, confirmed 27 Aug 2026. They must stay identical to the
// newsletter that went to the whole list — the two had drifted into different
// names for the same six things, which is what prompted this list existing in
// one place rather than being written out twice.
//
// Files live in the same private Spaces bucket as the shop, under a
// `launch_team/` prefix. Adding a file is a one-line edit here: put the object
// key in `files` and the item flips from "coming soon" to a working download,
// with no other code change.

export type MaterialStatus = 'ready' | 'coming' | 'link';

export interface LaunchMaterial {
  key: string;
  /** Mark's name for it. Do not rename without changing the newsletter too. */
  name: string;
  description: string;
  /** Spaces object keys. Empty means Mark has not sent the file yet. */
  files: { key: string; filename: string }[];
  /** For items that are a URL rather than a download. */
  href?: string;
  /** Shown when there is nothing to download yet. */
  note?: string;
}

export const LAUNCH_MATERIALS: LaunchMaterial[] = [
  {
    key: 'pattern_reflection_kit',
    name: 'Pattern Reflection Kit',
    description:
      'A guided kit for looking at one of your own repeating patterns, and what sits underneath it.',
    files: [{ key: 'launch_team/PatternReflectionKit.pdf', filename: 'Pattern Reflection Kit.pdf' }],
  },
  {
    key: 'boundarylessness_audio',
    name: 'Boundarylessness of Awareness',
    description:
      'The guided audio practice from Chapter 8. Listen straight through the first time, then return to it.',
    files: [
      {
        key: 'launch_team/Boundarylessness-of-Awareness.m4a',
        filename: 'Boundarylessness of Awareness.m4a',
      },
    ],
  },
  {
    key: 'selected_excerpts',
    name: 'Selected excerpts',
    description:
      'Early passages from Built This Way, so you know the message before you recommend it to anyone.',
    files: [],
  },
  {
    key: 'sharing_kit',
    name: 'Launch-week sharing kit',
    description:
      'Sample posts, email wording and book graphics. Everything you need to share the book without writing from scratch.',
    files: [],
  },
  {
    key: 'pattern_lab',
    name: 'Pattern Lab',
    description:
      'A private live session with Mark about the book, the practices, and the wider SkillfullyAware path. Joining details are emailed to launch team members beforehand.',
    files: [],
    note: 'Week of 26 October',
  },
  {
    key: 'reflection_tool',
    name: 'Why Did I React That Way?',
    description:
      'Bring one real reaction and get a personal reflection on the pattern underneath it. Free, and no account needed.',
    files: [],
    href: 'https://www.whydidireactthatway.com/?utm_source=drmarkpirtle&utm_medium=launchteam&utm_campaign=reflection_tool',
  },
];

/** True once a member can actually do something with this item. */
export function materialStatus(m: LaunchMaterial): MaterialStatus {
  if (m.href) return 'link';
  return m.files.length > 0 ? 'ready' : 'coming';
}

export const READY_COUNT = () =>
  LAUNCH_MATERIALS.filter((m) => materialStatus(m) !== 'coming').length;
