import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (



    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center py-20 px-6"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left side - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-lg text-gray-100 font-light">
              Our family's dedication to this noble material reflects a deep respect for its history and potential.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-6xl md:text-7xl font-serif font-light leading-tight">
              ABOUT
              <br />
              <span className="block border-t border-white/20 pt-4 mt-4">
                CAST
              </span>
            </h2>
          </div>

          <p className="text-sm text-gray-300 font-light max-w-md">
            For four generations, we've been crafting the legacy of metal transforming it from a raw material into timeless art.
          </p>
        </motion.div>

        {/* Right side - Image placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <img
            src="/images/bts_forest.jpg"
            alt="Behind the scenes"
            className="aspect-square object-cover rounded-lg w-full"
          />
          <div className="aspect-square bg-gradient-to-br from-gray-800 to-black rounded-lg mt-8" />
          <div className="aspect-square bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg -mt-8" />
          <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-lg" />
        </motion.div>
      </div>
    </section>

  );
}
