<template>
  <section class="portfolio-section py-5">
    <div class="pt-5">
      <div class="row align-items-center">
        <!-- Left Column: Laptop + Mobile -->
        <div class="col-lg-6">
          <div class="px-5">
            <h2 class="headline">A Collection Of My Work</h2>
            <!-- <h2 class="headline pt-0 mt-2">My Work</h2> -->

            <div
              class="portfolio-items d-flex justify-content-center gap-4 mt-4"
            >
              <!-- Laptop + Mobile in one line -->
              <div class="device-wrapper w-100 laptop-mobile gap-3">
                <!-- Mobile -->
                <div class="mobile-wrapper">
                  <img
                    class="mobile-frame"
                    src="/photos/mobile.png"
                    alt="Mobile frame"
                  />
                  <a
                    href="https://hamasatperfumes.com/"
                    target="_blank"
                    class="website-link"
                  >
                    <div class="website-marquee">
                      <div class="name-overlay">
                        <div class="name-content">
                          <div class="title">
                            {{
                              $i18n.locale === "ar"
                                ? "Hamasat Perfumes"
                                : "Hamasat Perfumes"
                            }}
                          </div>
                          <div class="visit-button">
                            {{
                              $i18n.locale === "ar"
                                ? "Visit Site"
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
                  <a
                    href="https://hamasatperfumes.com/"
                    target="_blank"
                    class="website-link"
                  >
                    <div class="website-marquee">
                      <div class="name-overlay">
                        <div class="name-content">
                          <div class="title">
                            {{
                              $i18n.locale === "ar"
                                ? "Hamasat Perfumes"
                                : "Hamasat Perfumes"
                            }}
                          </div>
                          <div class="visit-button">
                            {{
                              $i18n.locale === "ar"
                                ? "Visit Site"
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
        </div>

        <!-- Right Column: Marquee -->
        <div class="col-lg-6 mt-lg-0">
          <div
            class="marquee-container position-relative rounded-lg overflow-hidden"
          >
            <UiMarquee :pauseOnHover="true" class="marquee-duration">
              <template v-for="item in firstRow" :key="item.id">
                <WebsiteCard :item="item" />
              </template>
            </UiMarquee>

            <UiMarquee
              :reverse="true"
              :pauseOnHover="true"
              class="marquee-duration"
            >
              <template v-for="item in secondRow" :key="item.id">
                <WebsiteCard :item="item" />
              </template>
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
    name: "Oasis Business Center",
    type: "Real Estate",
    urlField: "https://oasisbusinesscentre.net/",
    image: "/works/7.png",
  },
  {
    id: 2,
    name: "Hamasat Perfumes",
    type: "E-commerce",
    urlField: "https://hamasatperfumes.com/",
    image: "/works/3.webp",
  },
  {
    id: 3,
    name: "Emarati Magazine",
    type: "News",
    urlField: "https://emaratimagazine.com/",
    image: "/works/1.png",
  },
  {
    id: 7,
    name: "Kahramana",
    type: "Real Estate",
    urlField: "https://kahramanarealestate.com/",
    image: "/works/8.png",
  },
  {
    id: 8,
    name: "Dqiqa",
    type: "Restaurant",
    urlField: "https://dqiqa.ly/",
    image: "/works/9.png",
  },
];

const secondRow = [
  {
    id: 4,
    name: "UAE Triathlon",
    type: "Sport",
    urlField: "https://triathlonuae.net/",
    image: "/works/4.png",
  },
  {
    id: 5,
    name: "Metaverse Training",
    type: "Education",
    urlField: "https://metavers-t.net/",
    image: "/works/10.webp",
  },
  {
    id: 6,
    name: "True Future",
    type: "Real Estate",
    urlField: "https://truefre.net/",
    image: "/works/2.svg",
  },
  {
    id: 9,
    name: "Massar School",
    type: "Education",
    urlField: "https://schooltec.org/",
    image: "/works/6.png",
  },
  {
    id: 10,
    name: "UAE Archery Federation",
    type: "Sport",
    urlField: "https://uaearchery.net/",
    image: "/works/5.webp",
  },
];
</script>

<style lang="scss" scoped>
.portfolio-section {
  background: linear-gradient(
    to bottom,
    #0a0a0a,
    #121212,
    #121212,
    #121212,
    #121212,
    #121212
  );
  color: #f0f0f0;

  .portfolio-items {
    margin-top: 30px;

    .device-wrapper {
      display: flex;
      // flex-direction: column-reverse;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1rem;

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
        max-width: 100%;
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

  /* Mobile styles */
  .mobile-wrapper {
    position: relative;
    width: 200px;
    max-width: 220px;
    margin: 0 auto;

    .mobile-frame {
      width: 100%;
      height: auto;
      pointer-events: none;
      z-index: 2;
      position: relative;
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
      position: relative;
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
    animation: vertical-scroll 25s linear infinite;
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
    border: 2px solid #59bc90;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #59bc90;
      color: #fff;
    }
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

.headline {
  font-size: 3rem;
  font-weight: bold;
  margin: 3rem 0;
  padding-bottom: 2rem;
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

@media (max-width: 991px) {
  .px-5 {
    padding: 0px 12px !important;
    margin-bottom: 30px;
  }

  .headline {
    margin: 0 !important;
  }

  .pt-5,.py-5{
    padding: 0 !important;
  }
}
</style>
