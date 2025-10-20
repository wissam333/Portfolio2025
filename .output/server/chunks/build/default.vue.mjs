import { o as useI18n, q as __nuxt_component_0 } from './server.mjs';
import { ref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import '../_/nitro.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import '@primeuix/utils';
import '@primeuix/styles/base';
import '@primeuix/utils/object';
import '@primeuix/utils/dom';
import '@primeuix/utils/eventbus';
import '@iconify/vue';

const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n();
    ref(null);
    ref([
      {
        selector: ".star1",
        title: "First Easter Egg",
        content: "Hover on snow to light up"
      },
      {
        selector: ".gotMe",
        title: "Second Easter Egg",
        content: "Find heisenberg"
      },
      {
        selector: ".SparklesText",
        title: "Third Easter Egg",
        content: "Scratch 'About Me' Word"
      },
      {
        selector: ".love-word",
        title: "Forth Easter Egg",
        content: "Click 'Love' Word"
      },
      {
        selector: ".moon",
        title: "Fifht Easter Egg",
        content: "Drag the floating astronaut to the moon"
      },
      {
        selector: "",
        title: "Sixth Easter Egg",
        content: "Open dev tools"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default.vue.mjs.map
