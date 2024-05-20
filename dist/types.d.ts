
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['tiktok']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['tiktok']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['tiktok']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['tiktok']?: ModuleOptions }
}


export { ModuleOptions, default } from './module'
