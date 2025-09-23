<template>
  <section class="portfolio-section py-5">
    <div class="container">
      <div class="row align-items-start">
        <!-- Left Column: Laptop + Mobile -->
        <div class="col-lg-6">
          <ElementsHeaderTitle
            class="pt-4 text-center text-light"
            :color="`#00ff7f`"
            :title="
              $i18n.locale === 'ar'
                ? 'التطبيقات والمواقع'
                : 'Web & Mobile Applications'
            "
          />

          <div class="portfolio-items d-flex justify-content-center gap-4 mt-4">
            <!-- Laptop + Mobile in one line -->
            <div
              class="device-wrapper laptop-mobile d-flex align-items-end gap-3"
            >
              <!-- Mobile -->
              <div class="mobile-wrapper">
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
                          {{ $i18n.locale === "ar" ? "App Name" : "App Name" }}
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
              <div class="laptop-wrapper">
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
                          {{
                            $i18n.locale === "ar"
                              ? "Website Name"
                              : "Website Name"
                          }}
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

        <!-- Right Column: Marquee -->
        <div class="col-lg-6 mt-5 mt-lg-0">
          <div
            class="marquee-container position-relative rounded-lg overflow-hidden"
          >
            <UiMarquee pause-on-hover class="marquee-duration">
              <WebsiteCard
                v-for="item in firstRow"
                :key="item.id"
                :item="item"
              />
            </UiMarquee>

            <UiMarquee reverse pause-on-hover class="marquee-duration">
              <WebsiteCard
                v-for="item in secondRow"
                :key="item.id"
                :item="item"
              />
            </UiMarquee>

            <!-- Side Fades -->
            <div class="fade-left"></div>
            <div class="fade-right"></div>
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
  background-color: #121212;
  color: #f0f0f0;

  .portfolio-items {
    margin-top: 30px;

    .device-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 1.5rem;

      .mobile-wrapper {
        max-width: 150px; // smaller than laptop
        position: relative;

        .mobile-frame {
          width: 100%;
          height: auto;
        }

        .website-link {
          position: absolute;
          top: 1.5%;
          left: 6%;
          width: 88%;
          height: 95%;
          border-radius: 12px;
          overflow: hidden;
          background: #1e1e1e;

          &:hover .marquee-content {
            animation-play-state: paused;
          }
        }
      }

      .laptop-wrapper {
        max-width: 350px;
        position: relative;

        .laptop-frame {
          width: 100%;
          height: auto;
        }

        .website-link {
          position: absolute;
          top: 3%;
          left: 17%;
          width: 66%;
          height: 74%;
          border-radius: 12px;
          overflow: hidden;
          background: #1e1e1e;

          &:hover .marquee-content {
            animation-play-state: paused;
          }
        }
      }
    }
  }

  .marquee-container {
    height: 500px;
    background-color: #1e1e1e;
    border: 1px solid #222;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;

    .fade-left,
    .fade-right {
      position: absolute;
      top: 0;
      width: 20%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
    }

    .fade-left {
      left: 0;
      background: linear-gradient(to right, #121212 0%, transparent 100%);
    }

    .fade-right {
      right: 0;
      background: linear-gradient(to left, #121212 0%, transparent 100%);
    }
  }
}
</style>
