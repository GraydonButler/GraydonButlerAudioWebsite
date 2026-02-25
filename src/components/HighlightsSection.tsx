/**
 * HIGHLIGHTS SECTION — Self-hosted video with full-width EQ visualizer
 * ─────────────────────────────────────────────────────────
 * HOW TO CONFIGURE:
 *  - Replace each `videoSrc` with the path to your video file in /public
 *    e.g. "/Videos/scavengers.mp4"
 *  - `poster` — path to a custom thumbnail image, or leave "" for none
 *  - `title`, `description`, `roles` — your content
 *
 * VIDEO ENCODING (run in terminal for each video):
 *   ffmpeg -i input.mp4 -vf scale=854:480 -c:v libx264 -crf 28 -c:a aac -b:a 320k output.mp4
 * ─────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useCallback, useContext, createContext } from 'react';
import { motion, useInView } from 'framer-motion';

interface Highlight {
  videoSrc: string;
  poster?: string;
  title: string;
  description: string;
  roles: string[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️  EDIT YOUR HIGHLIGHTS HERE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HIGHLIGHTS: Highlight[] = [
  {
    videoSrc: '/Videos/scavengers.mp4',
    poster: '/images/scavengers.jpg',
    title: 'Scavengers',
    description:
      'A brief description of the project, the artist, and the overall sonic direction you pursued together.',
    roles: ['Recording & tracking', 'Mix engineering', 'Vocal production'],
  },
  {
    videoSrc: '/Videos/verdant.mp4',
    poster: '/images/verdant.jpg',
    title: 'Verdant Sound Redesign',
    description:
      'Another project description. Keep it personal — talk about what made this session unique or challenging.',
    roles: ['Location sound recording', 'Post-production audio', 'Mastering'],
  },
  {
    videoSrc: '/Videos/actbyact.mp4',
    poster: '/images/actbyact.jpg',
    title: 'Actor Played By Actor',
    description:
      'A third description. Mention the genre, the feel, and what you brought to the table creatively.',
    roles: ['Sound design', 'Foley & ambience', 'Stems delivery'],
  },
];
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BAR_COUNT = 80;

// ─── Shared audio bus ─────────────────────────────────────────────────────────
interface AudioBusValue {
  registerVideo: (video: HTMLVideoElement) => void;
  setActiveVideo: (video: HTMLVideoElement | null) => void;
  getAnalyser: () => AnalyserNode | null;
}

const AudioBusCtx = createContext<AudioBusValue | null>(null);

function AudioBusProvider({ children }: { children: React.ReactNode }) {
  const actxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainsRef = useRef<Map<HTMLVideoElement, GainNode>>(new Map());
  const registeredRef = useRef<Set<HTMLVideoElement>>(new Set());

  const boot = useCallback(() => {
    if (actxRef.current) {
      if (actxRef.current.state === 'suspended') actxRef.current.resume();
      return actxRef.current;
    }
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;
    analyser.connect(ctx.destination);
    actxRef.current = ctx;
    analyserRef.current = analyser;
    return ctx;
  }, []);

  const registerVideo = useCallback((video: HTMLVideoElement) => {
    if (registeredRef.current.has(video)) return;
    registeredRef.current.add(video);
    const ctx = boot();
    const src = ctx.createMediaElementSource(video);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(gain);
    gain.connect(analyserRef.current!);
    gainsRef.current.set(video, gain);
  }, [boot]);

  const setActiveVideo = useCallback((video: HTMLVideoElement | null) => {
    gainsRef.current.forEach((gain, vid) => {
      gain.gain.value = vid === video ? 1 : 0;
    });
  }, []);

  const getAnalyser = useCallback(() => analyserRef.current, []);
  useEffect(() => () => { actxRef.current?.close(); }, []);

  return (
    <AudioBusCtx.Provider value={{ registerVideo, setActiveVideo, getAnalyser }}>
      {children}
    </AudioBusCtx.Provider>
  );
}

// ─── Full-width EQ canvas ─────────────────────────────────────────────────────
function GlobalEQ({ active }: { active: boolean }) {
  const bus = useContext(AudioBusCtx);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const smoothed = useRef<Float32Array>(new Float32Array(BAR_COUNT));
  const lastNoiseTime = useRef<number>(0);
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const refreshNoise = useCallback((W: number, H: number) => {
    if (!noiseCanvasRef.current) noiseCanvasRef.current = document.createElement('canvas');
    const nc = noiseCanvasRef.current;
    nc.width = W;
    nc.height = H;
    const nCtx = nc.getContext('2d');
    if (!nCtx) return;
    const imageData = nCtx.createImageData(W, H);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = Math.random() > 0.4 ? 255 : 0;
    }
    nCtx.putImageData(imageData, 0, 0);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.offsetWidth;
    const displayH = canvas.offsetHeight;
    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      ctx.scale(dpr, dpr);
    }

    const W = displayW;
    const H = displayH;
    const now = Date.now();

    if (now - lastNoiseTime.current > 350) {
      refreshNoise(W, H);
      lastNoiseTime.current = now;
    }

    ctx.clearRect(0, 0, W, H);

    let levels: number[] = [];
    const analyser = bus?.getAnalyser();

    if (analyser && active) {
      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteFrequencyData(data);
      const minBin = 2;
      const maxBin = Math.floor(bufLen * 0.80);
      const logMin = Math.log10(minBin);
      const logMax = Math.log10(maxBin);
      for (let i = 0; i < BAR_COUNT; i++) {
        const lo = Math.floor(Math.pow(10, logMin + (i / BAR_COUNT) * (logMax - logMin)));
        const hi = Math.floor(Math.pow(10, logMin + ((i + 1) / BAR_COUNT) * (logMax - logMin)));
        let sum = 0, n = 0;
        for (let b = lo; b <= hi && b < bufLen; b++) { sum += data[b]; n++; }
        const raw = n > 0 ? sum / n / 255 : 0;
        const t = i / (BAR_COUNT - 1);
        const lowCut = t < 0.3 ? 0.45 + (t / 0.3) * 0.55 : 1.0;
        const highBoost = t > 0.5 ? 1.0 + (t - 0.5) * 2.2 : 1.0;
        levels.push(Math.min(1, raw * lowCut * highBoost));
      }
    } else {
      const t = now / 1000;
      for (let i = 0; i < BAR_COUNT; i++) {
        const x = i / (BAR_COUNT - 1);
        levels.push(
          0.15 +
          0.30 * Math.sin(t * 0.6 + x * Math.PI * 2.5) +
          0.20 * Math.sin(t * 0.9 + x * Math.PI * 1.5 + 1.2) +
          0.10 * Math.sin(t * 1.4 + x * Math.PI * 4.0 + 2.4)
        );
      }
    }

    const att = active ? 0.45 : 0.10;
    const dec = active ? 0.14 : 0.05;
    for (let i = 0; i < BAR_COUNT; i++) {
      smoothed.current[i] =
        levels[i] > smoothed.current[i]
          ? smoothed.current[i] + (levels[i] - smoothed.current[i]) * att
          : smoothed.current[i] + (levels[i] - smoothed.current[i]) * dec;
    }

    const bw = W / BAR_COUNT;
    const gap = Math.max(2, bw * 0.55);

    for (let i = 0; i < BAR_COUNT; i++) {
      const barH = Math.max(2, smoothed.current[i] * H * 0.94);
      const x = i * bw + gap / 2;
      const w = bw - gap;
      const y = H - barH;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, barH);
      ctx.clip();

      if (noiseCanvasRef.current) {
        ctx.globalCompositeOperation = 'source-over';
        const baseAlpha = active ? 0.55 : 0.18;
        const heightBoost = 0.3 + smoothed.current[i] * 0.7;
        ctx.globalAlpha = baseAlpha * heightBoost;
        ctx.drawImage(noiseCanvasRef.current, 0, 0, W, H);
      }

      ctx.restore();

      if (smoothed.current[i] > 0.025) {
        ctx.fillStyle = active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)';
        ctx.fillRect(x, y, w, 1);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [bus, active, refreshNoise]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />;
}

// ─── Video card ───────────────────────────────────────────────────────────────
function VideoCard({
  highlight,
  index,
  activeIndex,
  onPlay,
  onStop,
}: {
  highlight: Highlight;
  index: number;
  activeIndex: number | null;
  onPlay: (index: number) => void;
  onStop: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const bus = useContext(AudioBusCtx);

  const isActive = activeIndex === index;
  const isHidden = activeIndex !== null && !isActive;

  const handlePlayClick = () => {
    const v = videoRef.current;
    if (!v) return;
    bus?.registerVideo(v);
    setPlaying(true);
    v.play();
  };

  const handlePlay = () => {
    bus?.setActiveVideo(videoRef.current);
    onPlay(index);
  };

  const handlePause = () => {
    const v = videoRef.current;
    if (!v || v.seeking) return;
    bus?.setActiveVideo(null);
    setPlaying(false);
    onStop();
  };

  const handleEnded = () => {
    bus?.setActiveVideo(null);
    setPlaying(false);
    onStop();
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{
        opacity: isInView ? (isHidden ? 0 : 1) : 0,
        y: isInView ? 0 : 40,
        scale: isActive ? 1.5 : 1,
        x: isActive
          ? index === 0 ? '55%'
            : index === 2 ? '-55%'
              : '0%'
          : '0%',
      }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        pointerEvents: isHidden ? 'none' : 'auto',
        transformOrigin: 'center center',
        zIndex: isActive ? 10 : 1,
        position: 'relative',
      }}
      className="flex flex-col gap-5"
    >
      {/* Video frame */}
      <div
        className="relative w-full overflow-hidden group cursor-pointer"
        style={{
          background: 'transparent',
          aspectRatio: '16/9',
        }}
      >
        <video
          ref={videoRef}
          src={highlight.videoSrc}
          poster={highlight.poster || undefined}
          controls={playing}
          playsInline
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: playing ? 1 : 0 }}
        />

        {!playing && (
          <div className="absolute inset-0">
            {highlight.poster && (
              <img
                src={highlight.poster}
                alt={highlight.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            )}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/25 transition-colors duration-300" />
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Play ${highlight.title}`}
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
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-start gap-4">
        <span className="text-xs text-white/70 font-mono mt-1 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-serif font-light tracking-wide text-white leading-tight">
          {highlight.title}
        </h3>
      </div>
      <p className="text-sm text-white/70 font-light leading-relaxed pl-8">{highlight.description}</p>
      <ul className="pl-8 space-y-1">
        {highlight.roles.map((role) => (
          <li key={role} className="flex items-center gap-2 text-xs text-white/70 font-light">
            <span className="w-3 h-px bg-white/30 shrink-0" />
            {role}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function HighlightsSection() {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const anyPlaying = activeIndex !== null;

  const handlePlay = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleStop = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <AudioBusProvider>
      <section id="highlights" className="py-28 px-6 bg-black text-white" style={{ overflow: 'visible' }}>
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
              My Youtube Channel →
            </a>
          </motion.div>

          {/* EQ + video grid wrapper */}
          <div className="relative">

            {/* Full-width EQ */}
            <div
              className="absolute pointer-events-none"
              style={{ inset: '-15% calc(-50vw + 50%)', zIndex: 0 }}
            >
              <GlobalEQ active={anyPlaying} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.88) 100%)' }} />
            </div>

            {/* Videos */}
            <div
              className="relative grid grid-cols-1 md:grid-cols-3 gap-12"
              style={{ zIndex: 1, overflow: 'visible' }}
            >
              {HIGHLIGHTS.map((h, i) => (
                <VideoCard
                  key={h.videoSrc}
                  highlight={h}
                  index={i}
                  activeIndex={activeIndex}
                  onPlay={handlePlay}
                  onStop={handleStop}
                />
              ))}
            </div>

          </div>
        </div>
      </section>
    </AudioBusProvider>
  );
}
