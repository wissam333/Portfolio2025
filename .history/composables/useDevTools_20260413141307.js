import { ref, onMounted, onUnmounted } from "vue";

export function useDevTools() {
  const devToolsOpen = ref(false);
  let pollId = null;

  function check() {
    // The regex toString trick — when devtools console is open,
    // it eagerly calls toString() on regex objects to display them.
    // We intercept that call with a getter override.
    let triggered = false;

    const regex = /./;
    regex.toString = () => {
      triggered = true;
      return "";
    };

    // This log is intentional — it's the detection mechanism.
    // devtools calls toString() on the regex when the console panel is open.
    console.log("%c", regex);
    console.clear();

    // Size fallback for docked devtools (bottom/side panel)
    const sizeDiff =
      window.outerWidth - window.innerWidth > 200 ||
      window.outerHeight - window.innerHeight > 200;

    devToolsOpen.value = triggered || sizeDiff;
  }

  onMounted(() => {
    check();
    // Poll every 500ms — resize alone misses F12 / keyboard shortcuts
    pollId = setInterval(check, 500);
  });

  onUnmounted(() => {
    clearInterval(pollId);
  });

  return { devToolsOpen };
}
