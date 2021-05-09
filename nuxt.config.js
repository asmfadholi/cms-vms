require('dotenv').config()

export default {
  // Target: https://go.nuxtjs.dev/config-target

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'CMS VMS APPS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
      { hid: 'description', name: 'description', content: 'Atur Visitormu di sini' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'ant-design-vue/dist/antd.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/lazy-load',
    '@/plugins/generate-url',
    '@/plugins/generate-uuid',
    '@/plugins/with-auth',
    { src: '@/plugins/mobile-detection', mode: 'client' },
    { src: '@/plugins/debounce', mode: 'client' },
    { src: '@/plugins/vue-moment', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/strapi',
    '@nuxtjs/proxy'
  ],

  strapi: {
    entities: ['areas', 'wahanas', 'users', 'tickets', 'forms', 'packages', 'visitors', 'wahana-visitors', 'upload'],
    expires: '31d'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    },
    meta: {
      viewport: 'width=device-width, initial-scale=1, user-scalable=no',
      theme_color: '#a997e6'
    },
    autoRegister: true,
    icon: {
      source: 'static/icon.png'
    }
  },
  proxy: {
    // Simple proxy
    '/api': {
      target: process.env.API_URL,
      pathRewrite: { '^/api': '' }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {

  }
}
