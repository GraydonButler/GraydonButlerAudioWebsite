import { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, (v) => -v * 0.2);
  const [pastThreshold, setPastThreshold] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setPastThreshold(latest > 100);
  });

  return (
    <section id="hero" className="min-h-[120vh] relative bg-black">

      {/* background roots parallax */}
      <motion.div
        className="fixed inset-0 -z-50"
        style={{
          width: '100%',
          height: '250%',
          backgroundImage: 'url(/images/roots-inverted.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY,
          filter: 'brightness(0) invert(1)',
          opacity: 0.12,
        }}
      />
      <div className="container mx-auto px-6 min-h-[120vh] flex items-center py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 w-full items-center">
          {/* Left Column - Graydon Butler Audio */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-serif font-light leading-[0.85] tracking-tight">
                <span className="block">GRAYDON</span>
                <span className="flex justify-end mt-2">
                  <span className="w-20 lg:w-28 h-px bg-white/40 self-center" />
                  <span>BUTLER</span>
                </span>
                <span className="flex justify-end mt-2">
                  <span className="w-20 lg:w-28 h-px bg-white/40 self-center" />
                  <span>AUDIO</span>
                </span>
              </h1>
            </motion.div>
            {/* quote under left */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm md:text-base text-gray-300 font-light max-w-md"
            >
              "There is no greater power than sound to make us feel."
              Robert Murch

            </motion.p>
          </div>
          {/* Right Column - Central Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 5, delay: 0.3 }}
            className="relative h-[400px] lg:h-[600px] flex items-center justify-center"
            style={{ isolation: 'isolate' }}
          >
            {/* animated frog effect — locked to 1:1 aspect ratio to match the SVG */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: '1/1', height: '100%', maxWidth: '100%' }}
            >
              <canvas
                ref={(canvas) => {
                  if (!canvas) return;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  const img = new Image();
                  img.src = '/images/stipple_vector_trace.svg';

                  img.onload = () => {
                    const draw = () => {
                      canvas.width = canvas.offsetWidth;
                      canvas.height = canvas.offsetHeight;
                      const imageData = ctx.createImageData(canvas.width, canvas.height);
                      for (let i = 0; i < imageData.data.length; i += 4) {
                        const v = Math.random() * 255;
                        imageData.data[i] = v;
                        imageData.data[i + 1] = v;
                        imageData.data[i + 2] = v;
                        imageData.data[i + 3] = Math.random() > 0.4 ? 255 : 0;
                      }
                      ctx.putImageData(imageData, 0, 0);
                      ctx.globalCompositeOperation = 'destination-in';
                      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                      ctx.globalCompositeOperation = 'source-over';
                      setTimeout(draw, 350);
                    };
                    draw();
                  };
                }}
                aria-hidden="true"
                className="absolute inset-0 w-full h-full"
              />
              <img
                src="/images/stipple_vector_trace.svg"
                alt="Audio Engineering"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: pastThreshold ? 0 : 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{
            opacity: [0.4, 1, 0.4],
            scaleY: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        >


          <canvas
            aria-hidden="true"
            ref={(canvas) => {
              if (!canvas) return;
              const ctx = canvas.getContext('2d');
              if (!ctx) return;
              canvas.width = 60;
              canvas.height = 40;

              const draw = (lastTime = 0) => {
                const now = Date.now();
                if (now - lastTime > 350) {
                  const imageData = ctx.createImageData(60, 40);
                  for (let i = 0; i < imageData.data.length; i += 4) {
                    const v = Math.random() * 255;
                    imageData.data[i] = v;
                    imageData.data[i + 1] = v;
                    imageData.data[i + 2] = v;
                    imageData.data[i + 3] = Math.random() > 0.4 ? 255 : 0;
                  }
                  ctx.putImageData(imageData, 0, 0);

                  // Draw chevron as mask
                  ctx.globalCompositeOperation = 'destination-in';
                  ctx.beginPath();
                  ctx.moveTo(30, 35);
                  ctx.lineTo(2, 5);
                  ctx.moveTo(30, 35);
                  ctx.lineTo(58, 5);
                  ctx.strokeStyle = 'white';
                  ctx.lineWidth = 2.5;
                  ctx.stroke();
                  ctx.globalCompositeOperation = 'source-over';

                  requestAnimationFrame(() => draw(now));
                } else {
                  requestAnimationFrame(() => draw(lastTime));
                }
              };
              draw();
            }}
            style={{ width: 60, height: 40 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
