<template>
  <div class="social-icons" data-aos="fade-left" data-aos-delay="1200">
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
        <div class="icon-link" @click="changeLang">
          <span class="social-icon">
            {{ $i18n.locale == "ar" ? "EN" : "AR" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Icons data using Nuxt Icons
const icons = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1Kv7doif6T/",
    iconName: "mdi:facebook",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/wissam-najjom-09ba06171?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    iconName: "mdi:linkedin",
  },
  {
    name: "GitHub",
    url: "https://github.com/wissam333",
    iconName: "mdi:github",
  },
];

const { locale, setLocale } = useI18n();
const changeLang = () => {
  if (locale.value == "ar") {
    setLocale("en");
    localStorage.setItem("lang", "en");
  } else {
    setLocale("ar");
    localStorage.setItem("lang", "ar");
  }
};
</script>

<style scoped>
.social-icons {
  position: fixed;
  z-index: 999;
  pointer-events: none;
  top: 100px;
  inset-inline-start: 20px;
}

.icons-inner {
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  background: rgba(160, 190, 255, 0.15);
  border: 1px solid rgba(200, 220, 255, 0.2);
  border-radius: 16px;
  padding: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(140, 180, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #e6f0ff;
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
  width: 30px;
  height: 30px;
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
  inset-inline-start: -100%;
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
  inset-inline-start: 100%;
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
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #000;
} /* GitHub */
.icon-link:nth-child(4):hover .social-icon {
  color: #8a2be2;
} /* AR */

/* Responsive adjustments */
@media (max-width: 768px) {
  .icons-inner {
    padding: 7px ;
    gap: 7px;
  }

  .icons-container {
    gap: 5px;
  }

  .icon-link {
    width: 30px;
    height: 30px;
  }

  .social-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
