<template>
  <div class="container-home" :style="{ padding: '24px', background: '#fff', minHeight: '100vh', margin: '16px 0' }">
    <div>
      <h3 v-if="$isAdminArea()">
        <a-space size="small">
          <a-icon type="profile" style="font-size: 15px;" />
          <nuxt-link :to="`/dashboard/area/${$cookies.get('area_slug')}`">
            <span>About Area</span>
          </nuxt-link>
        </a-space>
      </h3>
      <!-- <nuxt-link to="/dashboard/product/add">
        <a-button type="primary" icon="plus-circle" size="large">
          Tambah Produk
        </a-button>
      </nuxt-link>
      <nuxt-link to="/dashboard/product">
        <a-button type="primary" icon="ordered-list" size="large">
          List Produk
        </a-button>
      </nuxt-link> -->
    </div>
    <a-divider v-if="$isAdminArea()" />
    <div>
      <h3 v-if="$isAdminArea() || $isSuperAdmin()">
        <a-space size="small">
          <a-icon type="dollar" style="font-size: 15px;" />
          <nuxt-link to="/dashboard/wahana">
            <span>Manage Wahana</span>
          </nuxt-link>
        </a-space>
      </h3>
      <!-- <nuxt-link to="/dashboard/transaction/add">
        <a-button type="primary" icon="plus-circle" size="large">
          Buat Transaksi
        </a-button>
      </nuxt-link>

      <nuxt-link to="/dashboard/transaction">
        <a-button type="primary" icon="ordered-list" size="large">
          List Transaksi
        </a-button>
      </nuxt-link> -->
    </div>
    <a-divider v-if="$isAdminArea() || $isSuperAdmin()" />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'auth',
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
