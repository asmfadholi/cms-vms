<template>
  <div class="landing">
    <div class="landing-wrap-logo">
      <nuxt-link to="/">
        <img src="~assets/images/outing-logo.png" class="landing-logo" alt="pazarin">
      </nuxt-link>
    </div>
    <div class="landing-welcome">
      <h1>Selamat Datang di CMS VMS</h1>
      <p> Silahkan Klik Tombol di bawah ini</p>
      <LazyHomeButton />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
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
