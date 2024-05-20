import { defineNuxtPlugin, useRouter, useRuntimeConfig } from "#app";

class Tt {
  constructor(ttq, options) {
    this.options = options;
    this.ttq = ttq;
    this.ready = false;
    this.isEnabled = !options.disabled;
  }

  setTtq(ttq) {
    this.ttq = ttq;
    this.ready = true;
  }

  setPixelId(pixelId) {
    this.options.pixelId = pixelId;
  }

  /**
   * @method enable
   */
  enable() {
    this.isEnabled = true;
    this.init();
    this.page();
  }

  /**
   * @method disable
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * @method init
   */
  init() {
    if (!this.ready) return;
    this.ttq.load(this.options.pixelId);
  }

  /**
   * @method page
   */
  page() {
    if (!this.ready) return;
    this.ttq.page();
  }

  /**
   * @method track
   */
  track(event = null, parameters = null) {
    if (!this.ready) return;

    if (!event) {
      event = this.options.track;
    }

    if (this.isEnabled) this.ttq.track(event, parameters);
  }
}

function log(...messages) {
  console.info.apply(this, ["[nuxt-tiktok-pixel-module]", ...messages]);
}

export default defineNuxtPlugin((_nuxtApp) => {
  let _ttq;
  const runtimeConfig = useRuntimeConfig();
  const parsedOptions = runtimeConfig.public.tiktok;
  const router = useRouter();
  const isDev = parsedOptions?.dev && !parsedOptions?.debug;

  if (isDev)
    log(
      'You are running in development mode. Set "debug: true" in your nuxt.config.js if you would like to trigger tracking events in local.'
    );

  const pixelOptions = Object.assign({}, parsedOptions);

  const instance = new Tt(_ttq, pixelOptions);
  /* tsline-disable */
  if (typeof window !== "undefined") {
    ((w, d, t) => {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      _ttq = ttq;
      instance.setTtq(ttq);
      (ttq.methods = [
        "page",
        "track",
        "identify",
        "instances",
        "debug",
        "on",
        "off",
        "once",
        "ready",
        "alias",
        "group",
        "enableCookie",
        "disableCookie",
      ]),
        (ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      for (var i = 0; i < ttq.methods.length; i++)
        ttq.setAndDefer(ttq, ttq.methods[i]);
      (ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
          ttq.setAndDefer(e, ttq.methods[n]);
        return e;
      }),
        (ttq.load = function (e, n) {
          var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
          (ttq._i = ttq._i || {}),
            (ttq._i[e] = []),
            (ttq._i[e]._u = i),
            (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          var o = document.createElement("script");
          (o.type = "text/javascript"),
            (o.async = !0),
            (o.src = i + "?sdkid=" + e + "&lib=" + t);
          var a = document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o, a);
        });
      // log(!isDev && !pixelOptions.disabled);
      // if (!isDev && !pixelOptions.disabled) {
      //   ttq.load(pixelOptions.pixelId);
      //   ttq.page();
      // }
      if (pixelOptions.debug)
        document.cookie =
          "pixel_debug=true; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/; SameSite=None; Secure";
    })(window, document, "ttq");
  }
  /* eslint-enable */

  if (router) {
    router.afterEach(({ path }) => {
      /**
       * Change the current pixelId according to the route.
       */
      const pixelOptions = parsedOptions;
      if (pixelOptions.pixelId !== instance.options.pixelId) {
        instance.setPixelId(pixelOptions.pixelId);
      }
      /**
       * Automatically track PageView
       */
      if (parsedOptions.autoViewContent) {
        const contents = {
          content_id : 'none'
        }
        instance.track("ViewContent", contents);
      }
    });
  }
  /* eslint-enable */
  _nuxtApp.provide("tt", instance);
});
