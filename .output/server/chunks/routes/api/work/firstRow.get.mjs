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

const firstRow_get = defineEventHandler(async (event) => {
  const firstRow = [
    {
      id: 1,
      name: "Oasis Business Center",
      type: "Real Estate",
      urlField: "https://oasisbusinesscentre.net/",
      image: "/works/7.png"
    },
    {
      id: 2,
      name: "Hamasat Perfumes",
      type: "E-commerce",
      urlField: "https://hamasatperfumes.com/",
      image: "/works/3.webp"
    },
    {
      id: 3,
      name: "Emarati Magazine",
      type: "News",
      urlField: "https://emaratimagazine.com/",
      image: "/works/1.png"
    },
    {
      id: 7,
      name: "Kahramana",
      type: "Real Estate",
      urlField: "https://kahramanarealestate.com/",
      image: "/works/8.png"
    },
    {
      id: 8,
      name: "Dqiqa",
      type: "Restaurant",
      urlField: "https://dqiqa.ly/",
      image: "/works/9.png"
    }
  ];
  return {
    status: 200,
    data: firstRow,
    message: "First row portfolio items fetched successfully"
  };
});

export { firstRow_get as default };
//# sourceMappingURL=firstRow.get.mjs.map
