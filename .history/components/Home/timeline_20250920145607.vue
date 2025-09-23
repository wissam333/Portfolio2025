<template>
  <div class="experience_wrap">
    <!-- Decorative divider like skills page -->
    <div class="wrap">
      <div class="divider">
        <div class="ball"></div>
      </div>
    </div>

    <div class="experience">
      <h2 class="headline">Experience & Learning Journey</h2>
      <div class="container">
        <div class="row">
          <!-- Left section: floating/glassy cards -->
          <div
            class="section section1 col-lg-6"
            data-aos="fade-right"
            data-aos-duration="2000"
          >
            <div class="exp-cards">
              <div v-for="(item, index) in data" :key="index" class="exp-card">
                <h3>{{ item.title }}</h3>
                <span class="exp-date">{{ item.date }}</span>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <!-- Right section: simple list like Skills journey -->
          <div
            class="section section2 col-lg-6"
            data-aos="fade-left"
            data-aos-duration="2000"
          >
            <div class="exp">
              <ul class="exp-list">
                <li v-for="(item, index) in data" :key="index">
                  <span class="exp-year">{{ item.date }}</span>
                  <span class="exp-title">{{ item.title }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating stars/particles for style -->
    <div class="experience-stars">
      <span
        v-for="n in 25"
        :key="n"
        class="star"
        :style="getStarStyle(n)"
      ></span>
    </div>
  </div>
</template>

<script setup>
const { data } = await useFetch("/api/timeline");

function getStarStyle(n) {
  const size = Math.random() * 3 + 1;
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, rgba(255,255,255,${Math.random()}) 0%, transparent 70%)`,
    animationDuration: `${Math.random() * 5 + 3}s`,
  };
}
</script>

<style scoped>
.experience_wrap {
  background-color: #141415;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
  color: #fff;
}

/* Decorative divider */
.wrap .divider {
  margin: auto;
  width: 160px;
  height: 50px;
  position: relative;
}
.wrap .divider .ball {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
  border-top: 50px solid #000;
}

.experience .headline {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 3rem;
  color: #918bcc;
  text-shadow: 0 0 10px #918bcc66;
}

.exp-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.exp-card {
  background: rgba(145, 139, 204, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  transition: transform 0.4s, box-shadow 0.4s;
}
.exp-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(145, 139, 204, 0.5);
}
.exp-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  color: #fff;
}
.exp-date {
  display: block;
  font-weight: bold;
  color: #918bcc;
  margin-bottom: 0.5rem;
}
.exp-card p {
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Right section simple list */
.exp-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.exp-list li {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #ccc;
}
.exp-year {
  color: #918bcc;
}
.exp-title {
  color: #fff;
}

/* Floating stars/particles */
.experience-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.experience-stars .star {
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
</style>
