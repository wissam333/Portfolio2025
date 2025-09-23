import { ref, onMounted } from "vue";

export function useDevTools() {
  const devToolsOpen = ref(false);

  function detectDevTools() {
    try {
      const element = new Image();
      Object.defineProperty(element, "id", {
        get() {
          devToolsOpen.value = true;
          return "";
        },
      });
      console.log(element);
    } catch (e) {}
  }

  onMounted(() => {
    // Poll every 300ms dynamically
    setInterval(() => {
      devToolsOpen.value = false; // reset before detection
      detectDevTools();
    }, 300);
  });

  return { devToolsOpen };
}
