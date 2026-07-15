import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Force Vite to bundle and resolve these exact asset paths
import leftInsides from '../assets/left-insides.png';
import leftFaceplate from '../assets/left-faceplate.png';
import rightInsides from '../assets/right-insides.png';
import rightFaceplate from '../assets/right-faceplate.png';

export const HeroParallax: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(springX, [-0.5, 0.5], [-30, 30]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [30, -30]);
  
  const faceplateX = useTransform(springX, [-0.5, 0.5], [15, -15]);
  const faceplateY = useTransform(springY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseX.set((clientY / innerHeight) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden border-b border-border bg-bg-main"
      style={{ perspective: 1000 }}
    >
      <div className="absolute inset-0 w-full h-full flex flex-row items-center justify-center gap-6 md:gap-16 pointer-events-none select-none z-0 px-4">
        
        {/* ==================== LEFT IEM NODE ==================== */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center"
        >
          <div 
            className="absolute opacity-40 mix-blend-screen w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
            style={{ transform: "translateZ(-60px)" }}
          >
            <img 
              src={leftInsides} 
              alt="Left Internal Driver" 
              className="w-full h-full object-contain block"
            />
          </div>
          <motion.div 
            style={{ x: faceplateX, y: faceplateY, transformStyle: "preserve-3d" }}
            className="absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
            style={{ transform: "translateZ(40px)" }}
          >
            <img 
              src={leftFaceplate} 
              alt="Left Red Faceplate" 
              className="w-full h-full object-contain block drop-shadow-[0_20px_40px_rgba(217,119,6,0.25)]"
            />
          </motion.div>
        </motion.div>

        {/* ==================== RIGHT IEM NODE ==================== */}
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center"
        >
          <div 
            className="absolute opacity-40 mix-blend-screen w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
            style={{ transform: "translateZ(-60px)" }}
          >
            <img 
              src={rightInsides} 
              alt="Right Internal Driver" 
              className="w-full h-full object-contain block"
            />
          </div>
          <motion.div 
            style={{ x: faceplateX, y: faceplateY, transformStyle: "preserve-3d" }}
            className="absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px]"
            style={{ transform: "translateZ(40px)" }}
          >
            <img 
              src={rightFaceplate} 
              alt="Right Red Faceplate" 
              className="w-full h-full object-contain block drop-shadow-[0_20px_40px_rgba(217,119,6,0.25)]"
            />
          </motion.div>
        </motion.div>

      </div>

      <div className="relative z-20 text-center px-4 max-w-4xl pointer-events-auto mt-64 md:mt-80">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 text-primary drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          NARANDER RUBANS
        </h1>
        <p className="text-xs md:text-sm text-accent uppercase tracking-widest mb-6 font-bold">
          [ GEN AI & SYSTEMS ENGINEER / HYPRLAND ARCH ENVIRONMENT ]
        </p>
        <blockquote className="border-l border-accent bg-bg-card/90 backdrop-blur-md pl-4 italic text-muted max-w-xl mx-auto text-xs md:text-sm py-3 pr-4 rounded-r shadow-2xl">
          "Life as an engineer isn't always so nice but my themes and projects sure are, so I can cope with that satisfaction."[cite: 1]
        </blockquote>
      </div>
    </div>
  );
};
