<template>
  <Transition name="egg-slide">
    <div v-if="showEgg" class="easter-egg" :class="{ hide: isHiding }">
      <CelebrationParticles ref="particlesRef" />
      {{
        $i18n.locale === "ar"
          ? "هل تريد معرفة كيفية عمل هذا؟ 💀 انظر إلى console"
          : "Curious how this works 💀 ? Look At console"
      }}
    </div>
  </Transition>
</template>

<script setup>
const { devToolsOpen } = useDevTools();
const showEgg = ref(false);
const isHiding = ref(false);
const particlesRef = ref(null);

watch(devToolsOpen, (isOpen) => {
  if (!isOpen) return;

  isHiding.value = false;
  showEgg.value = true;
  particlesRef.value?.triggerParticles(50);

  if (!useEasterEggs().value.includes(3)) {
    useEasterEggs().value.push(3);
  }

  typeText();

  setTimeout(() => {
    isHiding.value = true;
    setTimeout(() => {
      showEgg.value = false;
      isHiding.value = false;
    }, 1000);
  }, 5000);
});

// Console typing effect — runs only client-side, no SSR issues
const text = `
Hi there! 👋
Hope you're enjoying my portfolio!
Take a closer look around, you might find some hidden surprises! 💎
`;

let i = 0;
const cursor = "|";

function typeText() {
  i = 0; // reset on each trigger
  tick();
}

function tick() {
  if (i > text.length) {
    blinkCursor();
    return;
  }
  const display = text.slice(0, i);
  console.clear();
  console.log(display + cursor);
  i++;
  const char = text[i - 1];
  const delay =
    char === "." || char === "!" || char === "?"
      ? 500
      : char === ","
        ? 250
        : 120;
  setTimeout(tick, delay);
}

function blinkCursor() {
  let show = true;
  const id = setInterval(() => {
    console.clear();
    console.log(text + (show ? cursor : " "));
    show = !show;
  }, 500);
  // Clean up after 30s to avoid eternal interval
  setTimeout(() => clearInterval(id), 30000);
}
</script>

<style scoped>
.easter-egg {
  position: fixed;
  top: 20px;
  inset-inline-end: 20px;
  background: linear-gradient(135deg, #ff6ec4, #7873f5);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  z-index: 9999;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 110, 196, 0.6);
  border: 2px solid #fff;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  transition:
    opacity 1s ease,
    transform 1s ease;
}

.egg-slide-enter-from,
.egg-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}
.egg-slide-enter-to,
.egg-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.egg-slide-enter-active,
.egg-slide-leave-active {
  transition:
    opacity 1s ease,
    transform 1s ease;
}
</style>
