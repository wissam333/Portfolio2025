<template>
  <div class="p-8 space-y-8">
    <h1 class="text-2xl font-bold">UiTour Test Page</h1>

    <button ref="btn1" class="btn" @click="startTour">Start Tour</button>

    <div ref="box1" class="demo-box">Box 1</div>
    <div ref="box2" class="demo-box">Box 2</div>
    <div ref="box3" class="demo-box">Box 3</div>

    <!-- Tour Component -->
    <UiTour ref="tour" v-model="tourActive" :steps="steps" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import UiTour from "~/components/UiTour.vue";

const tour = ref(null);
const tourActive = ref(false);

const steps = [
  {
    selector: "button",
    title: "Start Button",
    content: "Click this button to begin.",
  },
  {
    selector: ".demo-box:nth-child(2)",
    title: "Box 1",
    content: "This is the first box.",
  },
  {
    selector: ".demo-box:nth-child(3)",
    title: "Box 2",
    content: "This is the second box.",
  },
  {
    selector: ".demo-box:nth-child(4)",
    title: "Box 3",
    content: "Finally, the third box.",
  },
];

function startTour() {
  tourActive.value = true;
  // Start from first step programmatically after next tick
  setTimeout(() => {
    tour.value.start(0);
  }, 50);
}
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  background: #4cafef;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background: #2196f3;
}

.demo-box {
  width: 200px;
  height: 80px;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
}
</style>
