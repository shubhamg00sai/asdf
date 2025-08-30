import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

export default function Projects() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    get(ref(db, 'projects')).then((s) => {
      if (s.exists()) setData(s.val());
      setLoading(false);
    });
  }, []);

  const loadingGif = "https://i.gifer.com/ZZ5H.gif";

  return (
    <section
      id="projects"
      className="section bg-white text-gray-900 dark:bg-[#0b1220] dark:text-white py-10 transition-colors duration-300"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-10">{data?.title || 'Projects'}</h2>

        <div className="flex flex-col gap-16">
          {loading
            ? [1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="relative flex flex-row items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.2 }}
                >
                  <motion.div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 rounded shadow-lg z-10 flex justify-center items-center">
                    <motion.img
                      src={loadingGif}
                      alt="loading"
                      className="w-12 h-12"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    />
                  </motion.div>
                  <motion.div className="-ml-16 flex-1 relative flex justify-center items-center">
                    <motion.img
                      src={loadingGif}
                      alt="loading"
                      className="w-12 h-12"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    />
                  </motion.div>
                </motion.div>
              ))
            : data.items?.map((p: any, i: number) => (
                <motion.div
                  key={i}
                  className="relative flex flex-row items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="flex-1 relative cursor-pointer z-20"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedProject(p)}
                  >
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-64 object-cover rounded shadow-lg"
                      loading="lazy"
                    />
                  </motion.div>

                  <motion.div
                    className="-ml-16 flex-1 p-6 rounded shadow-lg z-10 relative cursor-pointer bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedProject(p)}
                  >
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    {p.description && <p className="text-gray-700 dark:text-gray-300 mt-2">{p.description}</p>}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-600 dark:text-cyan-400 hover:underline mt-2"
                      >
                        View Project →
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              ))}
        </div>

        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
            <motion.div
              className="bg-white dark:bg-gray-900 p-6 rounded shadow-xl max-w-lg w-full relative transition-colors duration-300"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-2 right-2 text-gray-900 dark:text-white text-2xl font-bold"
                onClick={() => setSelectedProject(null)}
              >
                &times;
              </button>

              <img
                src={selectedProject.img}
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded mb-4 cursor-pointer"
                onClick={() => {
                  if (selectedProject.link) window.open(selectedProject.link, '_blank');
                  setSelectedProject(null);
                }}
              />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{selectedProject.title}</h3>
              {selectedProject.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedProject.description}</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
