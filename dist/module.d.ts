import * as nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    pixelId?: string | null;
    track?: string;
    autoViewContent?: boolean;
    manualMode?: boolean;
    disabled?: boolean;
    debug?: boolean;
    dev?: boolean;
}
declare const _default: nuxt_schema.NuxtModule<ModuleOptions>;

export { ModuleOptions, _default as default };
