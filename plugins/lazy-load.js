import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import EmptyImage from '~/assets/images/empty-image.png'
import BlankImage from '~/assets/images/blank-image.png'

Vue.use(VueLazyload, {
  preLoad: 1,
  error: EmptyImage,
  loading: BlankImage,
  attempt: 1
})
