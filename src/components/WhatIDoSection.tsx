import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import CornerBox from './CornerBox';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const disciplines = [
    { title: 'Field Recording', description: "Capturing sounds in the world. Finding inspiring environments, textures, and and tones." },
    { title: 'Sound Design & Foley', description: 'Building immersive sonic worlds from the ground up, from individual layers to full soundscapes.' },
    { title: 'Composition & Scoring', description: 'Writing music that is functional, emotional, and purposeful.' },
    { title: 'Mix & Master', description: 'Delivering a polished, professional final product across any format or platform.' },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center py-20 px-6 text-white"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left side - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <h2 className="text-6xl md:text-7xl font-serif font-light leading-tight">
            WHAT I DO
          </h2>

          <CornerBox padding="p-3" className="w-full max-w-md">
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              I work with clients from first conversation to final delivery. Recording in the field,
              designing sounds digitally, and tweaking the final mix to bring it all together.
              I want to understand the projects tone, vision and intention to create sound that brings
              any project to its full potential.
            </p>
          </CornerBox>

          <div className="space-y-4 pt-2">
            {disciplines.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <CornerBox padding="p-3 pl-4" className="w-full">
                  <h3 className="text-sm font-serif tracking-wide mb-1">{d.title}</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">{d.description}</p>
                </CornerBox>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Image grid */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <img src="/images/bts_forest.jpg" alt="Behind the scenes" loading="lazy" className="aspect-square object-cover rounded-lg w-full" />
          <img src="/images/mix_board.jpg" alt="Studio session" loading="lazy" className="aspect-square object-cover rounded-lg w-full mt-8" />
          <img src="/images/protools_bts.jpg" alt="Pro Tools editing" loading="lazy" className="aspect-square object-cover rounded-lg w-full -mt-8" />
          <img src="/images/bananasquish.jpg" alt="Dialogue editing" loading="lazy" className="aspect-square object-cover rounded-lg w-full" />
        </motion.div>

      </div>
    </section>
  );
}
