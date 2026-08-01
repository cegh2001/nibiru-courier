import { motion, AnimatePresence } from 'framer-motion';

export const LoadingOverlay = ({ loading, LoadingComponent }) => {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="flex justify-center items-center text-center min-h-dvh z-50 absolute left-1/2 bg-white/0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingComponent />
        </motion.div>
      )}
    </AnimatePresence>
  );
};