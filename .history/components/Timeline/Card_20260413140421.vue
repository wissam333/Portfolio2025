<template>
  <div class="p-card" v-bind="$attrs">
    <div class="p-card-body">
      <div v-if="$slots.title" class="p-card-title">
        <slot name="title" />
      </div>
      <div v-if="$slots.subtitle" class="p-card-subtitle">
        <slot name="subtitle" />
      </div>
      <div v-if="$slots.content" class="p-card-content">
        <slot name="content" />
      </div>
      <div v-if="$slots.footer" class="p-card-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
</script>

<style scoped>
.p-card {
  background: transparent;
  border-radius: 0.5rem;
}

.p-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.p-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.p-card-subtitle {
  font-size: 0.85rem;
  opacity: 0.6;
  margin: 0;
}

.p-card-content {
  margin-top: 0.5rem;
}

.p-card-footer {
  margin-top: 0.75rem;
}
</style>
