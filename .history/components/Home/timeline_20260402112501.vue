<template>
  <UiVortex
    background-color="black"
    :particle-count="70"
    :base-hue="60"
    :hue-variation="80"
    :saturation="90"
    :lightness="60"
    :glow-strength="1.2"
  >
    <section class="experience-section">
      <h2 class="headline">
        {{
          $i18n.locale === "ar"
            ? "رحلة الخبرة والتعلم"
            : "Experience & Learning Journey"
        }}
      </h2>

      <Timeline :value="events" align="alternate" class="custom-timeline">
        <template #marker="slotProps">
          <span
            class="timeline-marker"
            :style="{ backgroundColor: slotProps.item.color }"
          >
            <Icon :name="slotProps.item.icon" class="icon" />
          </span>
        </template>

        <template #content="slotProps">
          <Card
            class="timeline-card"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
            :data-aos="slotProps.index % 2 === 0 ? 'flip-right' : 'flip-left'"
          >
            <template #title>
              {{
                $i18n.locale === "ar"
                  ? slotProps.item.titleAr
                  : slotProps.item.title
              }}
            </template>
            <template #subtitle>{{ slotProps.item.date }}</template>
            <template #content>
              <p>
                {{
                  $i18n.locale === "ar"
                    ? slotProps.item.descriptionAr
                    : slotProps.item.description
                }}
              </p>
            </template>
          </Card>
        </template>
      </Timeline>

      <!-- Floating decorative particles -->
      <div class="experience-stars" aria-hidden="true">
        <span
          v-for="(star, n) in decorativeStars"
          :key="n"
          class="star"
          :style="star"
        ></span>
      </div>
    </section>

    <img
      loading="lazy"
      class="oasis w-100"
      src="/pngegg2.webp"
      alt=""
      aria-hidden="true"
    />
  </UiVortex>
</template>

<script setup>
import Timeline from "primevue/timeline";
import Card from "primevue/card";

// ✅ Fixed: use useGetSiteApi instead of raw useFetch (follows project pattern)
const { GetAll } = useGetSiteApi();
const { data: eventsData } = await GetAll("/api/timeline", { isLazy: true });
const events = computed(() => eventsData.value?.data || []);

// ✅ Fixed: getStarStyle used Math.random() directly in v-for template binding.
// That re-generates random values on every re-render, causing hydration mismatches
// and janky layout. Pre-generate star styles once here instead.
const decorativeStars = Array.from({ length: 30 }, () => {
  const size = Math.random() * 5 + 3;
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, rgba(255,255,255,${Math.random().toFixed(2)}) 0%, transparent 70%)`,
    animationDuration: `${(Math.random() * 5 + 3).toFixed(1)}s`,
  };
});
</script>

<style scoped lang="scss">
.experience-section {
  position: relative;
  padding: 4rem 2rem;
  color: #ffffff;
  overflow: hidden;
  margin-top: 5rem;
  z-index: 10;

  @media (max-width: 991px) {
    padding: 0 12px;
  }

  .headline {
    font-size: 3rem;
    font-weight: bold;
    margin: 3rem 0;
    padding-bottom: 2rem;
    text-align: center;
    background: linear-gradient(
      90deg,
      #246145a4 0%,
      #64ffda 40%,
      #59bc90,
      #64ffda
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShine 4s linear infinite;

    @media (max-width: 991px) {
      font-size: 2rem;
    }
  }

  .custom-timeline {
    .p-timeline-event-opposite {
      flex: 0;
    }

    .timeline-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #fff;
      z-index: 10;
      box-shadow: 0 0 15px rgba(145, 139, 204, 0.5);
      transition:
        transform 0.15s ease,
        box-shadow 0.2s ease;
      cursor: pointer;

      &:active {
        transform: scale(0.92);
        box-shadow: 0 0 20px rgba(100, 255, 218, 0.6);
      }

      .icon {
        width: 20px;
        height: 20px;
      }
    }

    .timeline-card {
      background: rgba(255, 255, 255, 0.112);
      backdrop-filter: blur(10px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      z-index: 1;
      align-items: flex-start;
      text-align: start !important;
      transition:
        transform 0.15s ease,
        box-shadow 0.2s ease;
      cursor: pointer;

      &:active {
        transform: scale(0.92);
        box-shadow: 0 0 20px rgba(100, 255, 218, 0.6);
      }

      p {
        color: #ccc;
        font-size: 0.95rem;
        line-height: 1.5;
      }
    }
  }
}

.experience-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  .star {
    position: absolute;
    border-radius: 50%;
    animation: twinkle linear infinite;
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.2;
    transform: scale(0.5);
  }
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

:deep(.p-card-title) {
  color: #59bc90 !important;
}

.oasis {
  position: absolute;
  bottom: 0;
  z-index: 1;
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 80%);
  mask-image: linear-gradient(to bottom, transparent, black 80%);
  mask-repeat: no-repeat;
  mask-size: cover;
}

/* Mobile: left-aligned timeline */
@media (max-width: 768px) {
  :deep(.custom-timeline) {
    .p-timeline-event {
      flex-direction: row !important;
      align-items: flex-start !important;
      margin-bottom: 1rem;

      .p-timeline-event-opposite {
        display: none !important;
      }

      .p-timeline-event-content {
        padding: 0 !important;
        margin-left: 0.5rem !important;
        margin-top: 0 !important;
        flex: 1 !important;
      }

      .p-card-body {
        padding: 0 !important;
      }
      .timeline-marker {
        margin-top: 0.3rem !important;
      }
    }

    .p-timeline-event:nth-child(odd) {
      flex-direction: row-reverse !important;
      .p-timeline-event-content {
        margin-left: 0 !important;
        margin-right: 0.5rem !important;
      }
    }
  }
}
</style>
