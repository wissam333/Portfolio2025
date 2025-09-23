<template>
  <section class="portfolio-section py-5">
    <div class="container">
      <div class="row align-items-start">
        <!-- Left Column: Laptop + Mobile -->
        <div class="col-lg-6">
          <ElementsHeaderTitle
            class="pt-4 text-center"
            :color="`#333`"
            :title="
              $i18n.locale === 'ar'
                ? 'التطبيقات والمواقع'
                : 'Web & Mobile Applications'
            "
          />

          <!-- <div v-if="pending">
            <ElementsSpinner></ElementsSpinner>
          </div> -->

          <div class="portfolio-items">
            <div class="portfolio-item" data-aos="fade-up">
              <!-- Mobile -->
              <div class="mobile-wrapper mobile">
                <img
                  class="mobile-frame"
                  src="/photos/mobile.png"
                  alt="Mobile frame"
                />
                <a href="" target="_blank" class="website-link">
                  <div class="website-marquee">
                    <div class="name-overlay">
                      <div class="name-content">
                        <div class="title">
                          {{ $i18n.locale === "ar" ? "dddd" : "dddd" }}
                        </div>
                        <div class="visit-button">
                          {{
                            $i18n.locale === "ar"
                              ? "زيارة الموقع"
                              : "Visit Site"
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="marquee-content">
                      <img
                        src="/mobile.png"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                      <img
                        src="/mobile.png"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                    </div>
                  </div>
                </a>
              </div>

              <!-- Laptop -->
              <div class="laptop-wrapper laptop">
                <img
                  class="laptop-frame"
                  src="/photos/laptop.png"
                  alt="Laptop frame"
                />
                <a href="" target="_blank" class="website-link">
                  <div class="website-marquee">
                    <div class="name-overlay">
                      <div class="name-content">
                        <div class="title">
                          {{ $i18n.locale === "ar" ? "sssss" : "ssssss" }}
                        </div>
                        <div class="visit-button">
                          {{
                            $i18n.locale === "ar"
                              ? "زيارة الموقع"
                              : "Visit Site"
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="marquee-content">
                      <img
                        src="/laptop.png"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                      <img
                        src="/laptop.png"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Inspera Marquee -->
        <div class="col-lg-6 mt-5 mt-lg-0">
          <div
            class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
          >
            <!-- First Marquee -->
            <UiMarquee pause-on-hover class="[--duration:20s]">
              <template v-for="item in firstRow" :key="item.id">
                <WebsiteCard :item="item" />
              </template>
            </UiMarquee>

            <!-- Second Marquee (reverse) -->
            <UiMarquee reverse pause-on-hover class="[--duration:20s]">
              <template v-for="item in secondRow" :key="item.id">
                <WebsiteCard :item="item" />
              </template>
            </UiMarquee>

            <!-- Left Gradient -->
            <div
              class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
            ></div>

            <!-- Right Gradient -->
            <div
              class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const {
  public: { apiBase, api },
} = useRuntimeConfig();

let mobile = ref(false);

const checkWindowSize = () => {
  mobile.value = window.matchMedia("(max-width: 768px)").matches;
};

if (process.client) {
  onBeforeMount(() => checkWindowSize());
  onMounted(() => window.addEventListener("resize", checkWindowSize));
  onUnmounted(() => window.removeEventListener("resize", checkWindowSize));
}

const firstRow = [
  {
    id: 1,
    name: "Fitness App",
    type: "Mobile",
    urlField: "https://example.com/fitness",
    image: "/2.png",
  },
  {
    id: 2,
    name: "E-commerce Website",
    type: "E-commerce",
    urlField: "https://example.com/ecommerce",
    image: "/2.png",
  },
  {
    id: 3,
    name: "Real Estate Portal",
    type: "Real Estate",
    urlField: "https://example.com/realestate",
    image: "/2.png",
  },
];

const secondRow = [
  {
    id: 4,
    name: "Weather App",
    type: "Mobile",
    urlField: "https://example.com/weather",
    image: "/2.png",
  },
  {
    id: 5,
    name: "Learning Platform",
    type: "Education",
    urlField: "https://example.com/learning",
    image: "/2.png",
  },
  {
    id: 6,
    name: "Restaurant Website",
    type: "Food & Beverage",
    urlField: "https://example.com/restaurant",
    image: "/2.png",
  },
];
</script>

<style lang="scss" scoped>
.portfolio-section {
  background-color: #fff;

  .portfolio-items {
    display: grid;
    grid-template-columns: 1fr;
    gap: 50px;
    margin-top: 40px;

    @media (max-width: 768px) {
      gap: 40px;
    }
  }

  /* Mobile styles */
  .mobile-wrapper {
    position: relative;
    width: 100%;
    max-width: 220px;
    margin: 0 auto;

    .mobile-frame {
      width: 100%;
      height: auto;
      z-index: 2;
      pointer-events: none;
    }

    .website-link {
      position: absolute;
      top: 1.5%;
      left: 6.5%;
      width: 87%;
      height: 96%;
      overflow: hidden;
      border-radius: 12px;
      background: #f5f5f5;
      z-index: 1;

      &:hover .marquee-content {
        animation-play-state: paused;
      }
      &:hover .name-overlay {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  /* Laptop styles */
  .laptop-wrapper {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;

    .laptop-frame {
      width: 100%;
      height: auto;
      z-index: 2;
      pointer-events: none;
    }

    .website-link {
      position: absolute;
      top: 3.5%;
      left: 16.5%;
      width: 67%;
      height: 74%;
      overflow: hidden;
      background: #f5f5f5;
      z-index: 1;

      &:hover .marquee-content {
        animation-play-state: paused;
      }
      &:hover .name-overlay {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .website-marquee {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .marquee-content {
    display: flex;
    flex-direction: column;
    animation: vertical-scroll 15s linear infinite;
  }

  .website-screenshot {
    width: 100%;
    height: auto;
  }

  .name-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
    z-index: 3;
    padding: 15px;
    box-sizing: border-box;
    backdrop-filter: blur(2px);
  }

  .name-content {
    text-align: center;
    color: #333;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .visit-button {
    display: inline-block;
    padding: 8px 15px;
    border: 2px solid #007bff;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  @keyframes vertical-scroll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }
}
</style>
