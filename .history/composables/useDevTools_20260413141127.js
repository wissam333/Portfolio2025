import { ref, onMounted, onUnmounted } from "vue";

export function useDevTools() {
  const devToolsOpen = ref(false);

  let pollId = null;
  let wasOpen = false;

  function check() {
    // Timing trick: the `debugger` statement runs near-instantly normally,
    // but takes >10ms when devtools is open and paused on breakpoints.
    // We use a getter on a logged object — devtools calls the getter to
    // display the object, which we can time.
    let open = false;

    // Method 1: size heuristic (docked devtools)
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > 200 || heightDiff > 200) {
      open = true;
    }

    // Method 2: toString timing (undocked / detached devtools)
    if (!open) {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const elapsed = performance.now() - start;
      if (elapsed > 80) open = true;
    }

    // Method 3: getter-based detection (works in Chrome when console is open)
    if (!open) {
      let triggered = false;
      const obj = Object.defineProperty({}, "_", {
        get() {
          triggered = true;
          return undefined;
        },
      });
      // If devtools console is open, it eagerly evaluates the getter
      console.log(obj); // intentional — this IS the detection mechanism
      console.clear();
      if (triggered) open = true;
    }

    devToolsOpen.value = open;

    // Only fire the "opened" event once per session open
    if (open && !wasOpen) {
      wasOpen = true;
    } else if (!open) {
      wasOpen = false;
    }
  }

  onMounted(() => {
    check();
    pollId = setInterval(check, 1000);
    window.addEventListener("resize", check);
  });

  onUnmounted(() => {
    clearInterval(pollId);
    window.removeEventListener("resize", check);
  });

  return { devToolsOpen };
}
