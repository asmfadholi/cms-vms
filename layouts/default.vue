<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-content v-show="!loading" class="content-layout-default">
      <a-layout class="layout-item">
        <a-layout-content class="layout-content">
          <Nuxt />
        </a-layout-content>
      </a-layout>
    </a-layout-content>
    <a-spin v-if="loading" class="layout-spin" />
    <a-layout-footer class="layout-footer">
      VMS ©2021
    </a-layout-footer>
  </a-layout>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  transition: 'slide-bottom',
  data () {
    return {
      loading: false
    }
  }
})
</script>

<style scoped>
#components-layout-demo-top-side {
  min-height: 100vh;
  height: 100%;
}

.layout-content {
  padding: 0 24px;
}

.layout-spin {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  height: 242px;
}

.layout-footer {
  text-align: center;
}

.layout-item {
  padding: 24px 0;
  background: transparent;
  margin: 16px 0;
  max-width: 500px;
  width: 100%;
  height: 100%;
}

.content-layout-default {
  padding: 0 50px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
}

.slide-bottom-enter,
.slide-bottom-leave-to {
  opacity: 0;
  transform: translate3d(0, 15px, 0);
}

@media screen and (max-width: 500px) {
  .content-layout-default {
    padding: 0;
  }

  .header.ant-layout-header {
    padding: 0 10px;
  }
}
</style>
