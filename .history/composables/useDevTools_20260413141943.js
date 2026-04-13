import { ref, onMounted } from "vue";

export function useDevTools() {
  const devToolsOpen = ref(false);

  onMounted(() => {
    let threshold = 160; // px difference threshold

    function checkDevTools() {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      // Simple heuristic: DevTools is open if width or height changes significantly
      devToolsOpen.value = widthDiff > threshold || heightDiff > threshold;
    }

    // Initial check
    checkDevTools();

    // Listen to resize events
    window.addEventListener("resize", checkDevTools);
  });

  return { devToolsOpen };
}
