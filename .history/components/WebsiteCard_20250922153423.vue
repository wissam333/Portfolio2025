<template>
  <a :href="item.urlField" target="_blank" class="website-card">
    <div class="card-content">
      <!-- Logo / Image -->
      <div class="logo-wrapper">
        <img :src="item.image" alt="Logo" />
      </div>

      <!-- Info -->
      <div class="info">
        <div class="name">{{ item.name }}</div>
        <div class="type">{{ item.type }}</div>
        <div class="visit">Visit Site</div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
interface WebsiteItem {
  name: string;
  type: string;
  urlField: string;
  image: string;
}

const props = defineProps<{
  item: WebsiteItem;
}>();
</script>

<style scoped lang="scss">
.website-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  min-width: 200px;
  max-width: 220px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .logo-wrapper {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
    }
  }

  .info {
    .name {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .type {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }

    .visit {
      font-size: 12px;
      color: #007bff;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
}
</style>
