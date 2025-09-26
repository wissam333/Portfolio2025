<template>
  <UiVortex
    background-color="black"
    :particle-count="70"
    :base-hue="60"
    :hue-variation="80"
    :saturation="90"
    :lightness="60"
    :glow-strength="1.2"
    class=""
  >
    <section class="experience-section">
      <h2 class="headline">Experience & Learning Journey</h2>

      <div class="timeline-wrapper">
        <div class="timeline-inner">
          <Timeline :value="events" align="alternate" class="custom-timeline">
            <!-- Custom marker -->
            <template #marker="slotProps">
              <span
                class="timeline-marker"
                :style="{ backgroundColor: slotProps.item.color }"
              >
                <Icon :name="slotProps.item.icon" class="icon" />
              </span>
            </template>

            <!-- Custom content -->
            <template #content="slotProps">
              <Card class="timeline-card">
                <template #title>
                  {{ slotProps.item.title }}
                </template>
                <template #subtitle>
                  {{ slotProps.item.date }}
                </template>
                <template #content>
                  <p>{{ slotProps.item.description }}</p>
                </template>
              </Card>
            </template>
          </Timeline>
        </div>
      </div>

      <!-- Background stars -->
      <div class="experience-stars">
        <span
          v-for="n in 30"
          :key="n"
          class="star"
          :style="getStarStyle(n)"
        ></span>
      </div>
    </section>

    <img loading="lazy" class="oasis w-100" src="/pngegg.png" alt="" />
  </UiVortex>
</template>

<script setup>
import Timeline from "primevue/timeline";
import Card from "primevue/card";

const { data: eventsData } = await useFetch("/api/timeline");
const events = computed(() => eventsData.value?.data || []);

const getStarStyle = (n) => {
  const size = Math.random() * 5 + 3;
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, rgba(255,255,255,${Math.random()}) 0%, transparent 70%)`,
    animationDuration: `${Math.random() * 5 + 3}s`,
  };
};
</script>

<style scoped lang="scss">
.experience-section {
  position: relative;
  padding: 4rem 2rem;
  color: #ffffff;
  overflow: hidden;
  margin-top: 5rem;
  z-index: 10;
  .headline {
    font-size: 3rem;
    font-weight: bold;
    margin: 3rem 0;
    padding-bottom: 2rem;
    text-align: center;
    position: relative;
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
      .icon {
        width: 20px;
        height: 20px;
      }
    }

    .timeline-card {
      background: rgba(255, 255, 255, 0.112); // more transparent for dark bg
      backdrop-filter: blur(10px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.1); // subtle border
      border-radius: 1rem;
      padding: 1rem 1.5rem;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); // soft shadow
      z-index: 1;

      p {
        color: #ccc;
        font-size: 0.95rem;
        line-height: 1.5;
      }
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .custom-timeline {
      .p-timeline-event {
        flex-direction: column !important;

        .p-timeline-event-content {
          margin-left: 0 !important;
          margin-top: 1rem;
        }
      }
    }
  }

  /* Floating stars */
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
  }
}

:deep(.p-card-title) {
  color: #59bc90 !important;
}
@media (max-width: 768px) {
  .experience-section {
    padding: 0px 12px !important;
  }

  :deep(.custom-timeline) {
    .p-timeline-event {
      flex-direction: row !important; /* default: marker left, card right */
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
        text-align: left !important;
      }

      .timeline-marker {
        margin-top: 0.3rem !important;
      }
    }

    /* 🔄 Reverse odd items */
    .p-timeline-event:nth-child(odd) {
      flex-direction: row-reverse !important; /* marker right, card left */
      text-align: left !important;

      .p-timeline-event-content {
        margin-left: 0 !important;
        margin-right: 0.5rem !important;
      }

      .timeline-card {
        text-align: left !important; /* keep card text left-aligned even if marker flips */
      }
    }
  }
}

.oasis {
  position: absolute;
  bottom: 0;
  z-index: 1;
  /* Fade effect */
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 80%);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;

  mask-image: linear-gradient(to bottom, transparent, black 80%);
  mask-repeat: no-repeat;
  mask-size: cover;
}

.timeline-wrapper {
  position: relative;
  height: 80vh; /* container height */
  overflow-y: auto;
  padding-right: 0.5rem;

  /* scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #59bc90 #1a1a1a;
}

.timeline-inner {
  position: sticky;
  top: 0; /* sticks to top when scrolling */
  padding: 1rem 0;
}

.custom-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Animate each card in */
.timeline-card {
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.6s ease-out;
}

.timeline-card.is-visible {
  transform: translateY(0);
  opacity: 1;
}

</style>
