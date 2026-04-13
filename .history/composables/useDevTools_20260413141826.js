import { ref, onMounted, onUnmounted } from "vue";

export function useDevTools() {
  const devToolsOpen = ref(false);
  let pollId = null;
  let previousState = false;

  function check() {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    // 100px threshold — low enough to catch docked devtools,
    // high enough to ignore browser chrome / scrollbars (~17px)
    const isOpen = widthDiff > 100 || heightDiff > 100;

    // Only update the ref when state actually changes
    if (isOpen !== previousState) {
      previousState = isOpen;
      devToolsOpen.value = isOpen;
    }
  }

  onMounted(() => {
    check();
    pollId = setInterval(check, 300);
    window.addEventListener("resize", check);
  });

  onUnmounted(() => {
    clearInterval(pollId);
    window.removeEventListener("resize", check);
  });

  return { devToolsOpen };
}