'use client';
import { motion, AnimatePresence } from 'framer-motion';

export const PageWrapper = ({
  children,
  variant = '1',
}: {
  children: React.ReactNode;
  variant?: '1' | '2';
}) => {
  if (variant === '1') {
    return (
      <div className="z-30">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className=""
        >
          {children}
        </motion.div>
      </div>
    );
  } else if (variant === '2') {
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
