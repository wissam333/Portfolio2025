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
            <div
              v-for="(item, index) in data?.items"
              :key="item.id"
              class="portfolio-item"
              data-aos="fade-up"
              :data-aos-delay="index * 150"
            >
              <!-- Mobile -->
              <div class="mobile-wrapper" v-if="item.type === 'mobile'">
                <img
                  class="mobile-frame"
                  src="/photos/mobile.png"
                  alt="Mobile frame"
                />
                <a :href="item.urlField" target="_blank" class="website-link">
                  <div class="website-marquee">
                    <div class="name-overlay">
                      <div class="name-content">
                        <div class="title">
                          {{
                            $i18n.locale === "ar" ? item.name : item.englishName
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
                        :src="apiBase + item.image1"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                      <img
                        :src="apiBase + item.image1"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                    </div>
                  </div>
                </a>
              </div>

              <!-- Laptop -->
              <div class="laptop-wrapper" v-else>
                <img
                  class="laptop-frame"
                  src="/photos/laptop.png"
                  alt="Laptop frame"
                />
                <a :href="item.urlField" target="_blank" class="website-link">
                  <div class="website-marquee">
                    <div class="name-overlay">
                      <div class="name-content">
                        <div class="title">
                          {{
                            $i18n.locale === "ar" ? item.name : item.englishName
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
                        :src="apiBase + item.image1"
                        alt="Website preview"
                        class="website-screenshot"
                      />
                      <img
                        :src="apiBase + item.image1"
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
              <ReviewCard
                v-for="review in firstRow"
                :key="review.username"
                :img="review.img"
                :name="review.name"
                :username="review.username"
                :body="review.body"
              />
            </UiMarquee>

            <!-- Second Marquee (reverse) -->
            <UiMarquee reverse pause-on-hover class="[--duration:20s]">
              <ReviewCard
                v-for="review in secondRow"
                :key="review.username"
                :img="review.img"
                :name="review.name"
                :username="review.username"
                :body="review.body"
              />
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

let data = ref({
  items: [
    {
      id: 1,
      type: "mobile",
      name: "تطبيق الرياضة",
      englishName: "Fitness App",
      urlField: "https://example.com/fitness",
      image1: "/portfolio/mobile1.png",
    },
    {
      id: 2,
      type: "mobile",
      name: "تطبيق الطقس",
      englishName: "Weather App",
      urlField: "https://example.com/weather",
      image1: "/portfolio/mobile2.png",
    },
    {
      id: 3,
      type: "mobile",
      name: "تطبيق التعليم",
      englishName: "Learning App",
      urlField: "https://example.com/learning",
      image1: "/portfolio/mobile3.png",
    },

    // Laptop / Web
    {
      id: 4,
      type: "laptop",
      name: "موقع التجارة الإلكترونية",
      englishName: "E-commerce Website",
      urlField: "https://example.com/ecommerce",
      image1: "/portfolio/web1.png",
    },
    {
      id: 5,
      type: "laptop",
      name: "موقع المطعم",
      englishName: "Restaurant Website",
      urlField: "https://example.com/restaurant",
      image1: "/portfolio/web2.png",
    },
    {
      id: 6,
      type: "laptop",
      name: "موقع الأخبار",
      englishName: "News Website",
      urlField: "https://example.com/news",
      image1: "/portfolio/web3.png",
    },
  ],
});

let mobile = ref(false);

const checkWindowSize = () => {
  mobile.value = window.matchMedia("(max-width: 768px)").matches;
};

if (process.client) {
  onBeforeMount(() => checkWindowSize());
  onMounted(() => window.addEventListener("resize", checkWindowSize));
  onUnmounted(() => window.removeEventListener("resize", checkWindowSize));
}

// Inspera marquee data
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "Amazing!",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "Awesome!",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "Incredible!",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "Fantastic!",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "Superb!",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "Excellent!",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = ref(reviews.slice(0, reviews.length / 2));
const secondRow = ref(reviews.slice(reviews.length / 2));
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
