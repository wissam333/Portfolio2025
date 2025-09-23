<template>
  <Transition name="fade" appear>
    <div v-if="showMessage" class="version-message">first version</div>
  </Transition>
</template>

<script setup>
const showMessage = ref(true);

onMounted(() => {
  setTimeout(() => {
    showMessage.value = false;
  }, 5000);
});
</script>

<style scoped>
.version-message {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(236, 90, 90, 0.8);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
