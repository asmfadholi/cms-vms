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
      loading: true
    }
  },
  watch: {
    '$route' () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.loading = false
        }, 280)
      })
    }
  },
  mounted () {
    this.loading = true
    if (!this.$cookies.get('user_id') && this.$route.path !== '/') {
      if (!this.$route.path.includes('/login')) {
        this.$router.replace('/')
      } else {
        this.loading = false
      }
    } else if (!this.$route.path.includes('/dashboard') && this.$cookies.get('user_id')) {
      this.$router.replace('/dashboard')
    } else {
      this.loading = false
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
  background: #fff;
  margin: 16px 0;
  border-radius: 40px;
  box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
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
