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
$main-color: #00ff7f; // bright green for dark theme
$bg-color: #1e1e1e;
$text-color: #f0f0f0;
$shadow-color: rgba(0, 0, 0, 0.5);

.website-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-color;
  border-radius: 12px;
  padding: 20px 15px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 15px $shadow-color;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  margin: 0px 10px;
  cursor: pointer;
  text-decoration: none;
  color: $text-color;

  &:hover {
    box-shadow: 0 10px 25px $shadow-color;
    background: $bg-color;
    .logo-wrapper {
      img {
        mix-blend-mode: normal !important;
      }
    }
  }

  .logo-wrapper {
    width: 100%;
    height: 80px;
    margin-bottom: 15px;
    // background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
      mix-blend-mode: luminosity;
    }
  }

  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .name {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 5px;
      color: $main-color;
    }

    .type {
      font-size: 14px;
      color: $text-color;
      margin-bottom: 10px;
    }

    .visit {
      font-size: 12px;
      color: $main-color;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 5px 10px;
      border: 1px solid $main-color;
      border-radius: 20px;
      transition: all 0.3s ease;
      width: 150px;

      &:hover {
        background: $main-color;
        color: $bg-color;
      }
    }
  }
}
</style>
