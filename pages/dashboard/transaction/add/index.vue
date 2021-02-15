<template>
  <div class="container-home">
    <a-breadcrumb style="margin: 16px 0;">
      <nuxt-link to="/dashboard/transaction">
        <a-breadcrumb-item>Transaksi</a-breadcrumb-item>
      </nuxt-link>
      <a-breadcrumb-item>Buat</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
      <a-row>
        <a-col :span="12" class="transaction-title">
          <h1>
            <a-space size="middle">
              <a-icon type="dollar" style="font-size: 15px;" />
              <span>Buat Transaksi</span>
            </a-space>
          </h1>
        </a-col>
        <a-col :span="12" class="transaction-add-product">
          <a-button @click="visible = true">
            Tambah Produk
          </a-button>
        </a-col>
      </a-row>

      <a-divider />
      <FormTransaction />
      <a-modal
        class="modal-style"
        :mask-closable="false"
        title="Add Produk"
        :visible="visible"
        :footer="null"
        @cancel="onCancel"
      >
        <LazyFormProduct :data-edit="dataEdit" @onEdited="onEdited" />
      </a-modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import FormTransaction from '@/components/FormTransaction'

export default Vue.extend({
  components: {
    FormTransaction
  },
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      visible: false,
      dataEdit: null
    }
  },
  methods: {
    onCancel () {
      this.visible = false
    },
    onEdited () {}
  }
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0;
  }
}

.transaction-add-product {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.transaction-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
