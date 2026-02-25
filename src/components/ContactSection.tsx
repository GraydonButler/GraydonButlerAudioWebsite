import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const links = [
    {
      label: 'Email',
      value: 'graydonbaudio@gmail.com',
      href: 'mailto:graydonbaudio@gmail.com',
    },
    {
      label: 'LinkedIn',
      value: 'graydon-butler',
      href: 'https://www.linkedin.com/in/graydon-butler-8ab33120b/',
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="py-28 px-6 bg-black text-white"
    >
      <div className="container mx-auto max-w-6xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 flex items-end justify-between border-b border-white/10 pb-8"
        >
          <h2 className="text-6xl md:text-7xl font-serif font-light tracking-tight">
            CONTACT
          </h2>
        </motion.div>

        {/* Links */}
        <div className="flex flex-col gap-0">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="group flex items-center justify-between border-b border-white/10 py-8 hover:border-white/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-8">
                <span className="text-xs text-white/30 font-mono w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs text-white/40 font-light tracking-widest uppercase">
                  {link.label}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-lg md:text-2xl font-serif font-light tracking-wide text-white/80 group-hover:text-white transition-colors duration-300">
                  {link.value}
                </span>
                <motion.span
                  className="text-white/30 group-hover:text-white transition-colors duration-300 text-xl"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  →
                </motion.span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 text-xs text-white/20 font-light tracking-widest uppercase"
        >
          © {new Date().getFullYear()} Graydon Butler Audio
        </motion.p>

      </div>
    </section>
  );
}
