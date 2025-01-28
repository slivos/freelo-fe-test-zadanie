const useAutoResize = () => {
  const autoResize = (ref: HTMLElement | null) => {
    const textarea = ref;

    if (textarea) {
      textarea.style.height = "auto"; // Reset height to calculate the new one
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the new height
    }
  };

  return { autoResize };
};

export { useAutoResize };
