<template>
  <div class="container-home" :style="{ padding: '24px', background: '#fff', minHeight: '100vh', margin: '16px 0' }">
    <div>
      <h3>
        <a-space size="small">
          <a-icon type="dollar" style="font-size: 15px;" />
          <nuxt-link to="/dashboard/admin/wahana/wahana">
            <span>Manage Wahana</span>
          </nuxt-link>
        </a-space>
      </h3>
    </div>
    <a-divider />

    <div>
      <h3>
        <a-space size="small">
          <a-icon type="dollar" style="font-size: 15px;" />
          <nuxt-link to="/dashboard/admin/wahana/visitor">
            <span>Visitor Area</span>
          </nuxt-link>
        </a-space>
      </h3>
    </div>
    <a-divider />

    <div>
      <h3>
        <a-space size="small">
          <a-icon type="dollar" style="font-size: 15px;" />
          <nuxt-link to="/dashboard/admin/wahana/visitor-wahana">
            <span>Visitor Wahana</span>
          </nuxt-link>
        </a-space>
      </h3>
    </div>
    <a-divider />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  layout: 'layoutAdminWahana',
  middleware: 'authAdminWahana',
  transition: 'slide-bottom'
})
</script>

<style lang="scss" scoped>
.landing {
  .landing-logo {
    height: 120px;
    width: 120px;
    margin: auto 0;
    object-fit: contain;
    background: transparent;
  }

  .landing-wrap-logo {
    display: flex;
    justify-content: center;
  }

  .landing-welcome {
    margin-top: 24px;
    text-align: center;
  }
}
</style>
