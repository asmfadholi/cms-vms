<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh;">
    <div class="dashboard-sider">
      <!-- Desktop -->
      <a-layout-sider v-if="!isMobile" v-model="collapsed" theme="light" collapsible :style="{ position: isClient ? 'relative' : 'fixed', top: '0px', left: '0px', minHeight: '100vh'}">
        <img src="~assets/images/outing-logo.png" class="logo" alt="vms">
        <a-menu theme="light" :selected-keys="currentNavigation" mode="inline">
          <a-menu-item key="home">
            <nuxt-link to="/dashboard/admin/wahana">
              <div>
                <a-icon type="desktop" />
                <span>Beranda</span>
              </div>
            </nuxt-link>
          </a-menu-item>

          <a-menu-item key="wahana">
            <nuxt-link to="/dashboard/admin/wahana/wahana">
              <div>
                <a-icon type="dollar" />
                <span>Manage Wahana</span>
              </div>
            </nuxt-link>
          </a-menu-item>

          <a-menu-item key="visitor">
            <nuxt-link to="/dashboard/admin/wahana/visitor">
              <div>
                <a-icon type="dollar" />
                <span>Visitor Area</span>
              </div>
            </nuxt-link>
          </a-menu-item>

          <a-menu-item key="visitor-wahana">
            <nuxt-link to="/dashboard/admin/wahana/visitor-wahana">
              <div>
                <a-icon type="dollar" />
                <span>Visitor Wahana</span>
              </div>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- Mobile -->
      <div v-else>
        <a-drawer
          title="Basic Menu"
          placement="left"
          :closable="false"
          :visible="visibleDrawer"
          @close="visibleDrawer = false"
        >
          <div class="logo" />
          <a-menu theme="light" :selected-keys="currentNavigation" mode="inline">
            <a-menu-item key="home">
              <nuxt-link to="/dashboard">
                <div>
                  <a-icon type="desktop" />
                  <span>Beranda</span>
                </div>
              </nuxt-link>
            </a-menu-item>

            <a-menu-item key="area">
              <nuxt-link :to="`/dashboard/area/${$cookies.get('area_slug')}`">
                <div>
                  <a-icon type="profile" />
                  <span>About Area</span>
                </div>
              </nuxt-link>
            </a-menu-item>
          </a-menu>
        </a-drawer>
      </div>
    </div>

    <a-layout :style="{ position: 'relative', marginLeft: isClient ? '0px' : !isMobile ? marginLeft : '0px'}" class="layout-content">
      <a-layout-header style="background: #fff; padding: 0 16px;">
        <a-row>
          <a-col :span="12">
            <a-icon v-if="isMobile" type="menu" style="font-size: 20px; cursor: pointer;" @click="visibleDrawer = true" />
          </a-col>
          <a-col :span="12" class="dashboard-logout">
            <div>
              <a-button @click="onLogout">
                Logout
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content class="dashboard-content" :style="{ margin: isMobile ? '0px' : '16px' }">
        <Nuxt />
      </a-layout-content>
      <a-layout-footer style="text-align: center;">
        VMS ©2021
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import Vue from 'vue'
import imageOn from '~/assets/images/bluetooth-connect.png'
import imageOff from '~/assets/images/bluetooth-disabled.png'

export default Vue.extend({
  middleware: 'authAdminArea',
  transition: 'slide-bottom',
  data () {
    return {
      db: null,
      cats: null,
      imageOn,
      imageOff,
      visibleDrawer: false,
      isClient: false,
      loadingSyncBluetooth: false,
      show: false,
      loading: true,
      collapsed: false
    }
  },
  computed: {
    isMobile () {
      return process.server ? false : this.$isMobile()
    },
    marginLeft () {
      if (this.collapsed) {
        return '80px'
      }
      return '200px'
    },
    currentNavigation () {
      const { path = '' } = this.$route
      if (path.includes('admin/wahana/wahana')) { return ['wahana'] }
      if (path.includes('admin/wahana/visitor-wahana')) { return ['visitor-wahana'] }
      if (path.includes('admin/wahana/visitor')) { return ['visitor'] }
      return ['home']
    }
  },
  watch: {
    '$route' () {
      this.visibleDrawer = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.loading = false
        }, 280)
      })
    }
  },
  methods: {
    async onLogout () {
      await this.$strapi.logout()
      await this.$cookies.removeAll()
      this.$router.replace('/login')
    }
  }
})
</script>

<style lang="scss">
.dashboard-content {
  min-height: calc(100vh + 64px);
}

html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.dashboard-sider {
  background: white;
}

.layout-content {
  transition: margin-left 0.25s ease;
}

.layout-spin {
  display: flex;
  min-height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 242px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.dashboard-logout {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

body {
  overscroll-behavior: contain;
  min-width: 100%;
}

.ant-drawer-body {
  padding: 0;
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

#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.logo-bluetooth {
  color: #fff;
  height: 20px;
  width: 20px;
  object-fit: cover;
}
</style>
