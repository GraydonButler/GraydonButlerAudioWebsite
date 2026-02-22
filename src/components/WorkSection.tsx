/**
 * WORK SECTION — 4 expandable categories
 * ─────────────────────────────────────────────────────────
 * HOW TO CONFIGURE:
 *  - Each category has a `label` and an array of `items`
 *  - Each item has:
 *      `title`       — project name
 *      `year`        — string year e.g. "2024"
 *      `role`        — your credit on the project
 *      `description` — short sentence blurb (optional but recommended)
 *      `link`        — external URL (YouTube, Spotify, SoundCloud etc.) or ""
 *
 * ADD AS MANY ITEMS AS YOU LIKE — the category expands into a scrollable list.
 * ─────────────────────────────────────────────────────────
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface WorkItem {
  title: string;
  year: string;
  role: string;
  description?: string;
  link?: string;
}

interface WorkCategory {
  label: string;
  items: WorkItem[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️  EDIT YOUR 4 CATEGORIES HERE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WORK_CATEGORIES: WorkCategory[] = [
  {
    label: 'Recording',
    items: [
      {
        title: 'Project / Artist Name',
        year: '2024',
        role: 'Recording Engineer',
        description: 'Tracked drums, bass, and guitars for this indie rock record at Studio X.',
        link: '',
      },
      {
        title: 'Another Project',
        year: '2023',
        role: 'Recording Engineer',
        description: 'Live session capture for a 7-piece jazz ensemble.',
        link: '',
      },
      // add more...
    ],
  },
  {
    label: 'Mixing',
    items: [
      {
        title: 'Project / Artist Name',
        year: '2024',
        role: 'Mix Engineer',
        description: 'Full mix from stems — heavy parallel compression approach.',
        link: '',
      },
      {
        title: 'Another Project',
        year: '2023',
        role: 'Mix Engineer',
        description: 'Mixed a 14-track EP for an emerging folk artist.',
        link: '',
      },
      // add more...
    ],
  },
  {
    label: 'Production',
    items: [
      {
        title: 'Project / Artist Name',
        year: '2024',
        role: 'Producer',
        description: 'Developed the sonic palette and arrangement from scratch.',
        link: '',
      },
      // add more...
    ],
  },
  {
    label: 'Live & Field',
    items: [
      {
        title: 'Event / Artist Name',
        year: '2024',
        role: 'FOH Engineer',
        description: 'Front-of-house for a 500-cap venue, 32-channel digital desk.',
        link: '',
      },
      // add more...
    ],
  },
];
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function WorkRow({ item, index }: { item: WorkItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="border-b border-white/8 last:border-none"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between py-4 px-5 text-left hover:bg-white/[0.03] transition-colors duration-150"
      >
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-xs text-white/25 font-mono shrink-0 w-4">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-sm text-white font-light truncate">{item.title}</span>
        </div>
        <div className="flex items-center gap-6 shrink-0 ml-4">
          <span className="text-xs text-white/40 font-light hidden sm:block">{item.role}</span>
          <span className="text-xs text-white/30 font-mono">{item.year}</span>
          <span className="text-white/30 text-xs ml-2">{expanded ? '−' : '+'}</span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-14 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              {item.description && (
                <p className="text-xs text-gray-500 font-light max-w-md leading-relaxed">
                  {item.description}
                </p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 hover:text-white transition-colors duration-150 tracking-widest uppercase shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  Listen →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CategoryPanel({
  category,
  isOpen,
  onToggle,
  index,
}: {
  category: WorkCategory;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="border border-white/10 overflow-hidden"
    >
      {/* Category header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-6 text-left hover:bg-white/[0.04] transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/25 font-mono">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="text-2xl font-serif font-light tracking-wide text-white">
            {category.label}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30 font-light">
            {category.items.length} {category.items.length === 1 ? 'project' : 'projects'}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/40 text-xl font-light"
          >
            +
          </motion.span>
        </div>
      </button>

      {/* Scrollable inner list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div
              className="border-t border-white/8 overflow-y-auto"
              style={{ maxHeight: '360px' }}
            >
              {category.items.map((item, i) => (
                <WorkRow key={`${item.title}-${i}`} item={item} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function WorkSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true });

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="work" className="py-28 px-6 bg-black text-white">
      <div className="container mx-auto max-w-4xl">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 border-b border-white/10 pb-8"
        >
          <h2 className="text-6xl md:text-7xl font-serif font-light tracking-tight">WORK</h2>
          <p className="text-sm text-gray-500 font-light mt-4 max-w-sm">
            A categorised archive of projects, sessions, and collaborations.
          </p>
        </motion.div>

        {/* Category panels */}
        <div className="flex flex-col gap-3">
          {WORK_CATEGORIES.map((cat, i) => (
            <CategoryPanel
              key={cat.label}
              category={cat}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
