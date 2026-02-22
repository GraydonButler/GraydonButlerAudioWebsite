/**
 * HIGHLIGHTS SECTION
 * ─────────────────────────────────────────────────────────
 * HOW TO CONFIGURE:
 *  - Replace each `youtubeId` with the video ID from the YouTube URL
 *    e.g. https://youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ"
 *  - `thumbnail` — path to a custom image in /public, OR leave as ""
 *    to auto-use YouTube's own thumbnail
 *  - `title` — shown above the video
 *  - `description` — 1-3 sentence blurb shown below
 *  - `roles` — bullet points of your contributions
 * ─────────────────────────────────────────────────────────
 */

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Highlight {
  youtubeId: string;
  thumbnail?: string; // custom image path e.g. "/images/thumb1.jpg" — leave "" for auto YT thumb
  title: string;
  description: string;
  roles: string[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️  EDIT YOUR 3 HIGHLIGHTS HERE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HIGHLIGHTS: Highlight[] = [
  {
    youtubeId: 'YOUTUBE_VIDEO_ID_1', // ← replace this
    thumbnail: '',                    // ← custom thumb path or leave ""
    title: 'Project Title One',
    description:
      'A brief description of the project, the artist, and the overall sonic direction you pursued together.',
    roles: [
      'Recording & tracking',
      'Mix engineering',
      'Vocal production',
    ],
  },
  {
    youtubeId: 'YOUTUBE_VIDEO_ID_2',
    thumbnail: '',
    title: 'Project Title Two',
    description:
      'Another project description. Keep it personal — talk about what made this session unique or challenging.',
    roles: [
      'Location sound recording',
      'Post-production audio',
      'Mastering',
    ],
  },
  {
    youtubeId: 'YOUTUBE_VIDEO_ID_3',
    thumbnail: '',
    title: 'Project Title Three',
    description:
      'A third description. Mention the genre, the feel, and what you brought to the table creatively.',
    roles: [
      'Sound design',
      'Foley & ambience',
      'Stems delivery',
    ],
  },
];
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function VideoCard({ highlight, index }: { highlight: Highlight; index: number }) {
  const [playing, setPlaying] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });

  const thumbSrc =
    highlight.thumbnail && highlight.thumbnail !== ''
      ? highlight.thumbnail
      : `https://i.ytimg.com/vi/${highlight.youtubeId}/maxresdefault.jpg`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col gap-5"
    >
      {/* Video embed / thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-black group cursor-pointer">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${highlight.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={highlight.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbSrc}
              alt={highlight.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play video"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full border border-white/60 flex items-center justify-center backdrop-blur-sm bg-black/20"
              >
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </button>
          </>
        )}
      </div>

      {/* Title */}
      <div className="flex items-start gap-4">
        <span className="text-xs text-white/30 font-mono mt-1 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-serif font-light tracking-wide text-white leading-tight">
          {highlight.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 font-light leading-relaxed pl-8">
        {highlight.description}
      </p>

      {/* Roles */}
      <ul className="pl-8 space-y-1">
        {highlight.roles.map((role) => (
          <li key={role} className="flex items-center gap-2 text-xs text-gray-500 font-light">
            <span className="w-3 h-px bg-white/30 shrink-0" />
            {role}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function HighlightsSection() {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true });

  return (
    <section id="highlights" className="py-28 px-6 bg-black text-white">
      <div className="container mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 flex items-end justify-between border-b border-white/10 pb-8"
        >
          <h2 className="text-6xl md:text-7xl font-serif font-light tracking-tight">
            HIGHLIGHTS
          </h2>
          <a
            href="https://www.youtube.com/@GraydonButlerAudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 font-light tracking-widest uppercase hover:text-white transition-colors duration-200 mb-2"
          >
            View channel →
          </a>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {HIGHLIGHTS.map((h, i) => (
            <VideoCard key={h.youtubeId} highlight={h} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
