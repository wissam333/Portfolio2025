import { c as defineEventHandler } from '../../../_/nitro.mjs';
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

const secondRow_get = defineEventHandler(async (event) => {
  const secondRow = [
    {
      id: 4,
      name: "UAE Triathlon",
      type: "Sport",
      urlField: "https://triathlonuae.net/",
      image: "/works/4.png"
    },
    {
      id: 5,
      name: "Metaverse Training",
      type: "Education",
      urlField: "https://metavers-t.net/",
      image: "/works/10.webp"
    },
    {
      id: 6,
      name: "True Future",
      type: "Real Estate",
      urlField: "https://truefre.net/",
      image: "/works/2.svg"
    },
    {
      id: 9,
      name: "Massar School",
      type: "Education",
      urlField: "https://schooltec.org/",
      image: "/works/6.png"
    },
    {
      id: 10,
      name: "UAE Archery Federation",
      type: "Sport",
      urlField: "https://uaearchery.net/",
      image: "/works/5.webp"
    }
  ];
  return {
    status: 200,
    data: secondRow,
    message: "Second row portfolio items fetched successfully"
  };
});

export { secondRow_get as default };
//# sourceMappingURL=secondRow.get.mjs.map
