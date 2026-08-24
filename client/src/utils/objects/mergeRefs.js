export const mergeRefs = (...refs) => {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
      } else if (typeof ref === "object" && "current" in ref) {
        ref.current = node;
      }
    });
  };
};