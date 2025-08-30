import React, { useEffect, useState, useRef } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import { motion } from 'framer-motion';

interface Certificate {
  title: string;
  img: string;
  link: string;
}

export default function Certifications() {
  const [data, setData] = useState<{ title: string; items: Certificate[] } | null>(null);
  const [modal, setModal] = useState<Certificate | null>(null);
  const refScroll = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const loadingGif = "https://i.gifer.com/ZZ5H.gif";

  useEffect(() => {
    get(ref(db, 'certifications')).then((s) => {
      if (s.exists()) setData(s.val());
      else setData({ title: 'Certifications', items: [] });
    });
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (refScroll.current) {
      const w = refScroll.current.clientWidth;
      refScroll.current.scrollBy({ left: dir === 'left' ? -w : w, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!refScroll.current) return;
    isDown.current = true;
    startX.current = e.pageX - refScroll.current.offsetLeft;
    scrollLeft.current = refScroll.current.scrollLeft;
    refScroll.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => {
    isDown.current = false;
    if (refScroll.current) refScroll.current.style.cursor = 'grab';
  };
  const onMouseUp = () => {
    isDown.current = false;
    if (refScroll.current) refScroll.current.style.cursor = 'grab';
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !refScroll.current) return;
    e.preventDefault();
    const x = e.pageX - refScroll.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    refScroll.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section
      id="certifications"
      className="section py-12 bg-white text-gray-900 dark:bg-[#0b1220] dark:text-white transition-colors duration-300"
    >
      <div className="container relative">
        <h2 className="text-3xl font-bold mb-6">{data?.title || 'Certifications'}</h2>

        <div className="relative group">
          <motion.button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2, rotate: -10, boxShadow: '0px 0px 15px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            &#8592;
          </motion.button>

          <div
            ref={refScroll}
            className="flex gap-6 overflow-x-auto py-4 scroll-smooth no-scrollbar cursor-grab"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {data?.items?.length ? (
              data.items.map((c, i) => (
                <motion.div
                  key={i}
                  className="min-w-[280px] bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative overflow-hidden"
                  onClick={() => setModal(c)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-44 object-cover rounded-t-xl"
                  />
                  <div className="absolute bottom-0 w-full bg-white/90 dark:bg-black/90 text-center py-2">
                    <h3 className="font-semibold">{c.title}</h3>
                  </div>
                </motion.div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="min-w-[280px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                >
                  <motion.img
                    src={loadingGif}
                    alt="Loading..."
                    className="w-12 h-12"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  />
                </motion.div>
              ))
            )}
          </div>

          <motion.button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2, rotate: 10, boxShadow: '0px 0px 15px rgba(0,0,0,0.3)' }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            &#8594;
          </motion.button>
        </div>

        {modal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl max-w-md w-full relative transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modal.img}
                alt={modal.title}
                className="w-full h-64 object-cover rounded cursor-pointer"
                onClick={() => {
                  if (modal.link) {
                    window.open(modal.link, '_blank');
                    setModal(null);
                  }
                }}
              />
              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{modal.title}</h3>
              {modal.link && (
                <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 text-center">
                  Tap image to open certificate
                </p>
              )}
              <button
                className="absolute top-2 right-2 text-gray-900 dark:text-white text-xl font-bold"
                onClick={() => setModal(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
