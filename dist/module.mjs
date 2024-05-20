import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "nuxt3-tiktok-pixel",
    configKey: "tiktok"
  },
  // Default configuration options of the Nuxt module
  defaults: {
    pixelId: null,
    track: "ViewContent",
    autoViewContent: false,
    manualMode: false,
    disabled: false,
    debug: false,
    dev: false
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.tiktok = options;
    options.dev = nuxt.options.dev;
    addPlugin(resolver.resolve("./runtime/plugin"));
  }
});

export { module as default };
