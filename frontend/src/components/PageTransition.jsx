import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}      // Start invisible
      animate={{ opacity: 1 }}      // Fade in to 100%
      exit={{ opacity: 0 }}         // Fade out to 0%
      transition={{ duration: 0.2, ease: "easeInOut" }} // 0.4s makes it feel silky
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;