import { motion } from "framer-motion";

interface BootLineProps {
  text: string;
  delay: number;
}

export default function BootLine({
  text,
  delay,
}: BootLineProps) {
  return (
    <motion.p
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
        duration: 0.25,
      }}
    >
      {text}
    </motion.p>
  );
}
