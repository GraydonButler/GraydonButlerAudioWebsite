import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import CornerBox from './CornerBox';

function AnimatedBorderImage({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastNoiseTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const border = 6;

    const draw = () => {
      const now = Date.now();
      if (now - lastNoiseTime.current > 350) {
        lastNoiseTime.current = now;
        const W = canvas.width;
        const H = canvas.height;

        const imageData = ctx.createImageData(W, H);
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const inBorder =
              x < border || x > W - border || y < border || y > H - border;
            if (inBorder) {
              const i = (y * W + x) * 4;
              const v = Math.random() * 255;
              imageData.data[i] = v;
              imageData.data[i + 1] = v;
              imageData.data[i + 2] = v;
              imageData.data[i + 3] = Math.random() > 0.4 ? 220 : 0;
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative" style={{ aspectRatio: '3/4' }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{ boxShadow: 'inset 0 0 80px 30px black' }}
      />
      {/* Noise border */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none rounded-lg"
      />
    </div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about-me"
      ref={ref}
      className="min-h-screen flex items-center py-20 px-6 text-white"
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 md:scale-95 md:translate-x-4"
          >
            <AnimatedBorderImage src="/images/graydon.jpg" alt="Graydon Butler" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2 space-y-8"
          >
            <h2 className="text-6xl md:text-7xl font-serif font-light">
              ABOUT ME
            </h2>

            <CornerBox padding="p-3" className="w-full max-w-md">
              <p className="text-gray-300 text-sm leading-relaxed">
                I'm a Vancouver-based sound designer, mixer, composer, recordist and audio engineer.
                After graduating from the Sound Design for Visual Media program at Vancouver Film School, I've worked
                across film and game media to create specially designed dialogue, sound effects, music and any additional audio required.
              </p>
            </CornerBox>

            <CornerBox padding="p-3" className="w-full max-w-md">
              <p className="text-gray-400 text-sm leading-relaxed">
                Audio should be stylized, original, purposeful, functional, and most of all entertaining.
                Getting to work with others and playing to my creative and technical strengths to create something meaningful
                is truly a gift that keeps me excited to get to work every day.
              </p>
            </CornerBox>

            <div className="space-y-4 pt-2">
              {[
                { title: 'Film & Post Production', description: 'Sound design, re-recording, ADR/VO, and full post audio delivery.' },
                { title: 'Game Audio', description: 'Asset pipeline python tools, adaptive music systems, and implementation in Wwise, Fmod, Unreal, and Unity' },
                { title: 'Music', description: 'Songwriter, producer, and engineer across rock, pop, rap, EDM, jazz, and ambient.' },
                { title: 'Tools', description: 'Reaper, Pro Tools, Ableton, Izotope RX, Serum 2, Soundtoys, Waves.' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="border-l-0 pl-0"
                >
                  <CornerBox padding="p-3 pl-4" className="w-full">
                    <h3 className="text-sm font-serif tracking-wide mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">{item.description}</p>
                  </CornerBox>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}