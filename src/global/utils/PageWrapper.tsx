"use client";
import { motion, AnimatePresence } from "framer-motion";

export const PageWrapper = ({
  children,
  variant = "1",
}: {
  children: React.ReactNode;
  variant?: "1" | "2";
}) => {
  if (variant === "1") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className=""
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  } else if (variant === "2") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          exit={{ x: -1000 }}
          transition={{ duration: 0.5 }}
          className=""
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }
};
