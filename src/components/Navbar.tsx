import React, { useEffect, useState, useRef } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

interface NavbarProps {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ dark, setDark }: NavbarProps) {
  const [nav, setNav] = useState<any>(null);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Load navbar data
  useEffect(() => {
    get(ref(db, "navbar")).then((s) => {
      if (s.exists()) setNav(s.val());
    });
  }, []);

  // Apply dark mode class to HTML
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const links = nav?.links ?? [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "contact", label: "Contact" },
  ];

  // 3D Tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const xSpring = useSpring(rotateX, { stiffness: 100, damping: 15 });
  const ySpring = useSpring(rotateY, { stiffness: 100, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 15;
    const y = -(e.clientY / innerHeight - 0.5) * 15;
    rotateX.set(y);
    rotateY.set(x);
  };
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Scroll hide/reveal
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.header
        className="fixed w-full top-0 left-0 z-50 flex justify-end px-6 py-4"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Desktop Nav */}
        <motion.nav
          className="hidden md:flex gap-8 items-center"
          style={{
            rotateX: xSpring,
            rotateY: ySpring,
            transformStyle: "preserve-3d",
          }}
        >
          {links.map((l: any) => (
            <motion.a
              key={l.id}
              href={"#" + l.id}
              className="relative px-2 py-1 text-base font-semibold capitalize group 
                         text-neutral-800 dark:text-neutral-200"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                {l.label}
              </span>
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
            </motion.a>
          ))}

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setDark(!dark)}
            whileTap={{ scale: 0.85, rotateY: 180 }}
            transition={{ duration: 0.4 }}
            className="ml-6 p-2 rounded-full shadow-lg 
                       bg-neutral-200 dark:bg-neutral-800 
                       text-neutral-800 dark:text-neutral-200"
          >
            {dark ? <Moon size={22} /> : <Sun size={22} />}
          </motion.button>
        </motion.nav>

        {/* Mobile Hamburger (always) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden ml-4 text-neutral-800 dark:text-neutral-200"
        >
          <Menu size={28} />
        </button>
      </motion.header>

      {/* Floating Menu Button (Desktop only when navbar hidden) */}
      {hidden && (
        <button
          onClick={() => setMenuOpen(true)}
          className="hidden md:flex fixed top-4 right-6 z-50 p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 shadow-lg 
                     text-neutral-800 dark:text-neutral-200"
        >
          <Menu size={26} />
        </button>
      )}

      {/* Slide Menu (same for mobile & desktop) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 h-full w-64 bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-xl z-50 p-6 flex flex-col"
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="self-end mb-6 text-neutral-800 dark:text-neutral-200"
        >
          <X size={28} />
        </button>
        <div className="flex flex-col gap-6 mt-4">
          {links.map((l: any) => (
            <a
              key={l.id}
              href={"#" + l.id}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-medium text-neutral-800 dark:text-neutral-200 hover:text-cyan-500 transition"
            >
              {l.label}
            </a>
          ))}

          {/* Dark Mode Toggle in Menu */}
          <button
            onClick={() => setDark(!dark)}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg 
                       bg-neutral-200 dark:bg-neutral-800 
                       text-neutral-800 dark:text-neutral-200"
          >
            {dark ? <Moon size={20} /> : <Sun size={20} />}
            {dark ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </motion.div>
    </>
  );
}
