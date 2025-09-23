import { ref, onMounted } from "vue";

export function useDevTools() {
  const devToolsOpen = ref(false);

  onMounted(() => {
    // Method 1: Using an object getter trick
    const element = new Image();
    Object.defineProperty(element, "id", {
      get() {
        devToolsOpen.value = true;
        return "";
      },
    });
    console.log(element);

    // Method 2: Optional extra check with debugger timing
    let start = performance.now();
    debugger;
    let end = performance.now();
    if (end - start > 100) devToolsOpen.value = true;
  });

  return { devToolsOpen };
}
