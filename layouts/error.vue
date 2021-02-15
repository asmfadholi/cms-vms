<template>
  <div class="error-container">
    <div>
      <img
        v-lazy=""
        alt="Empty"
      >
      <h2>
        Oops, halaman tidak ditemukan.
      </h2>
      <a-button
        variant="secondary"
        @click="$router.replace('/')"
      >
        {{ $strapi.user ? 'Masuk ke Dashboard' : 'Kembali ke Home' }}
      </a-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  scrollToTop: true,
  transition: 'slide-bottom'
})
</script>

<style lang="scss" scoped>
.error-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
  text-align: center;

  img {
    margin-bottom: 20px;
    height: 150px;
    width: 150px;
    object-fit: cover;
  }
}
</style>
