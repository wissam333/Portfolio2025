<template>
  <div
    :class="['social-icons', positionClass]"
    data-aos="fade-left"
    data-aos-delay="1200"
  >
    <div class="icons-inner">
      <!-- Icons -->
      <div class="icons-container">
        <a
          v-for="icon in icons"
          :key="icon.name"
          :href="icon.url"
          target="_blank"
          class="icon-link"
          :aria-label="icon.name"
        >
          <Icon :name="icon.iconName" class="social-icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  position: { type: String, default: "bottom-right" }, // UI position
});

const positionClass = computed(() => {
  switch (props.position) {
    case "top-left":
      return "pos-top-left";
    case "top-right":
      return "pos-top-right";
    case "bottom-left":
      return "pos-bottom-left";
    default:
      return "pos-bottom-right";
  }
});

// Icons data using Nuxt Icons
const icons = [
  {
    name: "Facebook",
    url: "https://facebook.com",
    iconName: "mdi:facebook",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    iconName: "mdi:linkedin",
  },
  {
    name: "GitHub",
    url: "https://github.com",
    iconName: "mdi:github",
  },
  {
    name: "AR",
    url: "#", // Add your AR experience URL here
    iconName: "mdi:augmented-reality",
  },
];
</script>

<style scoped>
.social-icons {
  position: fixed;
  z-index: 999;
  pointer-events: none;
}
.pos-bottom-left {
  bottom: 20px;
  left: 20px;
}
.pos-bottom-right {
  bottom: 20px;
  right: 20px;
}
.pos-top-left {
  top: 100px;
  left: 20px;
}
.pos-top-right {
  top: 100px;
  right: 20px;
}

.icons-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  background: rgba(160, 190, 255, 0.15);
  border: 1px solid rgba(200, 220, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(140, 180, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #e6f0ff;
  font-family: "Inter", sans-serif;
}

/* Icons Container */
.icons-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.icon-link:hover::before {
  left: 100%;
}

.icon-link:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 20px rgba(100, 150, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.social-icon {
  width: 22px;
  height: 22px;
  color: #e6f0ff;
  transition: all 0.3s ease;
}

.icon-link:hover .social-icon {
  color: #ffffff;
  filter: drop-shadow(0 0 8px rgba(180, 220, 255, 0.6));
}

/* Specific icon colors on hover */
.icon-link:nth-child(1):hover .social-icon {
  color: #1877f2;
} /* Facebook */
.icon-link:nth-child(2):hover .social-icon {
  color: #0077b5;
} /* LinkedIn */
.icon-link:nth-child(3):hover .social-icon {
  color: #ffffff;
} /* GitHub */
.icon-link:nth-child(4):hover .social-icon {
  color: #8a2be2;
} /* AR */

/* Responsive adjustments */
@media (max-width: 768px) {
  .icons-inner {
    padding: 14px;
    gap: 14px;
  }

  .icons-container {
    gap: 10px;
  }

  .icon-link {
    width: 40px;
    height: 40px;
  }

  .social-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
