import { c as defineEventHandler } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@primevue/core/base/style';
import '@primeuix/styles/tooltip';
import '@primeuix/styles/ripple';
import '@primeuix/styled';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';

const timeline_get = defineEventHandler(async (event) => {
  const events = [
    {
      title: "Start Journey",
      date: "2018",
      icon: "mdi:briefcase-account",
      color: "#9C27B0",
      description: "Started learning web basics, discovered passion for coding."
    },
    {
      title: "Learning JS",
      date: "2019",
      icon: "mdi:code",
      color: "#673AB7",
      description: "Learned JavaScript, Pascal, and C++ basics."
    },
    {
      title: "University & SQL",
      date: "2020",
      icon: "mdi:database",
      color: "#FF9800",
      description: "Studied SQL, C++, Java, Sass, Bootstrap, JS DOM/BOM."
    },
    {
      title: "First Job",
      date: "2021",
      icon: "mdi:briefcase",
      color: "#607D8B",
      description: "Learned Vue 2 and worked at Dr Social Company."
    },
    {
      title: "Vue 3 & Freelancing",
      date: "2022",
      icon: "mdi:remote-desktop",
      color: "#9C27B0",
      description: "Worked as freelancer, plan to master Nuxt & backend skills."
    },
    {
      title: "Remote Work",
      date: "2023",
      icon: "mdi:code-brackets",
      color: "#a89233",
      description: "Worked as Vue developer for 3 companies."
    },
    {
      title: "FSIT Company",
      date: "2024",
      icon: "mdi:code-braces",
      color: "#59bc90",
      description: "Worked as Nuxt developer at FSIT company for 1.5 years."
    }
  ];
  return {
    status: 200,
    data: events,
    message: "Events fetched successfully"
  };
});

export { timeline_get as default };
//# sourceMappingURL=timeline.get.mjs.map
