export const createVariants = () => {
  const variants = {
    enter: (direction) => ({
      x: direction === 1 ? -1000 : 1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === 1 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return variants;
};

export const transition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.5 },
};
