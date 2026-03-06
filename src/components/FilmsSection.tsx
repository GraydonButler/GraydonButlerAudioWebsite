/**
 * FILMS SECTION — Horizontally scrollable film catalogue
 * ─────────────────────────────────────────────────────────
 * HOW TO CONFIGURE:
 *  - Add as many entries to FILMS as you like — the row grows automatically
 *  - `poster` — path to image in /public e.g. "/images/films/scavengers.jpg"
 *  - `youtubeUrl` — full YouTube URL, opened in new tab on click
 *  - `title`, `year`, `role`, `description` — your content
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface Film {
  poster: string;
  title: string;
  year: string;
  role: string | string[];
  description: string;
  youtubeUrl?: string;        // single link — shows "Watch Here"
  stereoUrl?: string;         // shows "Watch in Stereo"
  surroundUrl?: string;       // shows "Watch in 5.1"
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️  EDIT YOUR FILMS HERE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FILMS: Film[] = [
  {
    poster: '/images/scavengersposter.jpg',
    title: 'Scavengers',
    year: '2025',
    role: 'Sound Design, Mixing, Music',
    description: 'My VFS Graduation project. From script writing, casting, and video editing to source foley recording, sound design and mixing in 5.1',
    stereoUrl: 'https://www.youtube.com/watch?v=YOUTUBE_ID_STEREO',
    surroundUrl: 'https://www.youtube.com/watch?v=YOUTUBE_ID_51',
  },
  {
    poster: '/images/noexitposter.JPG',
    title: 'No Exit',
    year: '2026',
    role: 'Sound Design, Audio Editing',
    description: 'Directed and produced by vancouver film club, contracted by Zerux',
    youtubeUrl: 'https://youtu.be/7_FJnu6F9Co',
  },
  {
    poster: '/images/films/film-three.jpg',
    title: 'Actor Played By Actor',
    year: '2025',
    role: 'Lead Sound',
    description: 'Indie project. credits include on set sound recording, ADR, dialogue edit, sound design and final mix and delivery',
    stereoUrl: 'https://www.youtube.com/watch?v=YOUTUBE_ID_STEREO',
    surroundUrl: 'https://www.youtube.com/watch?v=YOUTUBE_ID_51',
  },
  {
    poster: '/images/teotwposter.png',
    title: 'The End Of The World',
    year: '2026',
    role: 'Foley, SFX Design, Composer',
    description: '',
    youtubeUrl: 'https://youtu.be/7_FJnu6F9Co',
  },
  {
    poster: '/images/films/film-five.jpg',
    title: "Luna's Friends",
    year: '2026',
    role: 'Dialogue Edit',
    description: '30 minute indie film about a new girl meeting her boyfriends friends.',
  },
  {
    poster: '/images/films/film-six.jpg',
    title: 'Film Title Six',
    year: '2021',
    role: 'Sound Designer',
    description: 'What made this project stand out and why you are proud of the work.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YOUTUBE_ID',
  },
];
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FilmCard({ film, index }: { film: Film; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-60px' });

  const hasBothVersions = film.stereoUrl && film.surroundUrl;
  const singleUrl = film.youtubeUrl ?? film.stereoUrl ?? film.surroundUrl;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex-shrink-0 flex flex-col"
      style={{ width: '260px' }}
    >
      {/* Poster */}
      <div className="relative overflow-hidden bg-white/5" style={{ aspectRatio: '2/3' }}>
        <div className="absolute inset-0 bg-neutral-900" />

        <img
          src={film.poster}
          alt={film.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }}
        />

        {/* Year badge */}
        <span className="absolute top-3 right-3 text-[10px] font-mono text-white/50 tracking-widest">
          {film.year}
        </span>
      </div>

      {/* Info below poster */}
      <div className="pt-4 flex flex-col gap-1.5">
        <h3 className="text-base font-light tracking-wide text-white leading-tight">

          {film.title}
        </h3>

        {/* Roles */}
        <div className="flex flex-col gap-1 mt-0.5">
          {(Array.isArray(film.role) ? film.role : [film.role]).map((r) => (
            <div key={r} className="flex items-center gap-2">
              <span className="w-3 h-px bg-white/30 shrink-0" />
              <span className="text-xs text-white/50 font-light tracking-widest uppercase">
                {r}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/50 font-light leading-relaxed mt-1">
          {film.description}
        </p>

        {/* Watch links — only shown if at least one URL exists */}
        {(hasBothVersions || singleUrl) && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {hasBothVersions ? (
              <>
                <a
                  href={film.stereoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-light tracking-widest uppercase border border-white/20 px-3 py-1.5 text-white/50 hover:text-white hover:border-white/50 transition-colors duration-200"
                >
                  Stereo
                </a>
                <a
                  href={film.surroundUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-light tracking-widest uppercase border border-white/20 px-3 py-1.5 text-white/50 hover:text-white hover:border-white/50 transition-colors duration-200"
                >
                  5.1
                </a>
              </>
            ) : (
              <a
                href={singleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-light tracking-widest uppercase border border-white/20 px-3 py-1.5 text-white/50 hover:text-white hover:border-white/50 transition-colors duration-200"
              >
                Watch Here →
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Draggable scroll thumb
function ScrollThumb({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement> }) {
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const [thumbWidth, setThumbWidth] = useState(20);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const ratio = el.clientWidth / el.scrollWidth;
      setThumbWidth(Math.max(8, Math.round(ratio * 100)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [scrollRef]);

  const left = useTransform(scrollXProgress, [0, 1], [`0%`, `${100 - thumbWidth}%`]);

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-white/50 group-hover:bg-white/70 transition-colors duration-200"
      style={{ width: `${thumbWidth}%`, left }}
    />
  );
}

export default function ProjectsSection() {
  const headingRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true });

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section id="projects" className="py-28 bg-black text-white">

      {/* Heading — inside container */}
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex items-end justify-between border-b border-white/10 pb-8"
        >
          <h2 className="text-6xl md:text-7xl font-serif font-light tracking-tight">
            PROJECTS
          </h2>
          <span className="text-xs text-white/30 font-light tracking-widest uppercase mb-2 select-none">
            Drag to scroll →
          </span>
        </motion.div>
      </div>

      {/* Scrollable row — bleeds to screen edges */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex gap-6 overflow-x-auto select-none"
        style={{
          cursor: 'grab',
          paddingLeft: 'max(1.5rem, calc((100vw - 72rem) / 2))',
          paddingRight: 'max(1.5rem, calc((100vw - 72rem) / 2))',
          paddingBottom: '1rem',
          scrollbarWidth: 'none' as const,
          // @ts-ignore
          msOverflowStyle: 'none',
        }}
      >
        {FILMS.map((film, i) => (
          <FilmCard key={film.title} film={film} index={i} />
        ))}
      </div>

      {/* Large grabbable scrollbar */}
      <div className="container mx-auto px-6 max-w-6xl mt-6">
        <div
          className="relative h-12 flex items-center cursor-grab active:cursor-grabbing group"
          onMouseDown={(e) => {
            if (!scrollRef.current) return;
            const track = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - track.left) / track.width;
            const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
            scrollRef.current.scrollLeft = ratio * maxScroll;

            // Allow dragging along the track
            const onMove = (ev: MouseEvent) => {
              if (!scrollRef.current) return;
              const r = (ev.clientX - track.left) / track.width;
              scrollRef.current.scrollLeft = Math.max(0, Math.min(1, r)) * maxScroll;
            };
            const onUp = () => {
              window.removeEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
          }}
        >
          {/* Track background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-200" />

          {/* Thumb — sized and positioned by scroll progress */}
          <ScrollThumb scrollRef={scrollRef} />
        </div>
      </div>

    </section>
  );
}
