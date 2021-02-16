<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px;" />
          <span>Manage Staff</span>
          <!-- <a-button v-if="dataSync.length > 0" type="default" :loading="loadingSync" @click="syncData">
            Sync
          </a-button> -->
        </a-space>
      </h1>
    </div>
    <a-divider />
    <a-row style="margin: 0 0 20px;">
      <a-col :span="12">
        <a-input
          v-model="search"
          v-debounce="doSearch"
          placeholder="Cari Staff Area"
        />
      </a-col>
      <a-col :span="12">
        <div style="display: flex; justify-content: flex-end;">
          <a-button type="primary" icon="plus-circle" size="default" @click="onCreate">
            Tambah Staff
          </a-button>
        </div>
      </a-col>
    </a-row>

    <LazyTableUserArea
      ref="tableUser"
      :data="users"
      :pagination="pagination"
      @onDeleted="onDeleted"
      @onEdit="onEdit"
      @onPagination="onPagination"
    />
    <a-modal
      class="modal-style"
      :mask-closable="false"
      :title="dataEdit ? 'Update Staff' : 'Tambah Staff'"
      :visible="visible"
      :footer="null"
      @cancel="onCancel"
    >
      <LazyFormUserArea :data-edit="dataEdit" @onEdited="refreshTable" @onCreated="refreshTable" />
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  async asyncData ({ $strapi, $getAuthWithArea, redirect, $cookies }) {
    try {
      const getUsersArea = $strapi.$users.find($getAuthWithArea({ _start: 0, _limit: 10, '_where[0][role.type_ne]': 'admin_area', '_where[1][role.type_ne]': 'super_admin' }))
      const countUsers = $strapi.$users.count($getAuthWithArea({ '_where[0][role.type_ne]': 'admin_area', '_where[1][role.type_ne]': 'super_admin' }))
      const wrapRequest = [getUsersArea, countUsers]
      const res = await Promise.all(wrapRequest)
      const users = res[0]
      const total = res[1]
      return { users, total, start: 0, limit: 10 }
    } catch (err) {
      const { response = {} } = err || {}
      const { status = 0 } = response
      if (status === 403) {
        await $strapi.logout()
        await $cookies.removeAll()
        redirect('/sorry')
      }
    }
  },
  data () {
    return {
      loadingSync: false,
      users: [],
      visible: false,
      search: '',
      dataEdit: null,
      testPage: 1,
      testTotal: null,
      loading: false
    }
  },
  computed: {
    pagination () {
      if (this.$nuxt.isOffline) { return {} }
      return { current: (this.start / this.limit) + 1, total: this.total }
    },
    db () {
      return this.$store.state.indexdb.db
    }
    // dataSync () {
    //   return this.$store.state.indexdb.products.filter(fil => typeof fil.id === 'string')
    // }
  },
  // async created () {
  //   if (process.server) { return }
  //   await this.$store.dispatch('indexdb/getProducts')
  //   if (this.$nuxt.isOffline && this.db) {
  //     this.products = this.$store.state.indexdb.products
  //   } else {
  //     this.addBulkProductToIdb(this.productList)
  //   }
  // },
  methods: {
    // async syncDataHard () {
    //   this.loadingSync = true
    //   let countProducts = this.testTotal
    //   if (!countProducts) {
    //     countProducts = await this.$strapi.$products.count(this.$getWithAuth())
    //     this.testTotal = countProducts
    //   }
    //   const paramsProducts = this.$getWithAuth({ _start: (this.testPage - 1) * 50, _limit: 50 })
    //   const getProducts = await this.$strapi.$products.find(paramsProducts)

    //   const containerProducts = getProducts.filter(fil => !fil.productId).map(prod => this.$strapi.update('products', prod.id || 0, { productId: this.$uuid() }))
    //   await Promise.all(containerProducts)
    //   const isContinue = Math.ceil(countProducts / 50) >= this.testPage
    //   if (isContinue) {
    //     this.testPage++
    //     this.syncDataHard()
    //   } else {
    //     this.loadingSync = false
    //   }
    // },

    // async syncData () {
    //   const dataProducts = this.dataSync
    //   try {
    //     this.loadingSync = true
    //     const storeCreateProducts = dataProducts.map(prod => this.$strapi.$products.create(this.generateDataProduct(prod)))
    //     await Promise.all(storeCreateProducts)
    //     const storeProduct = dataProducts.map(prod => this.$store.dispatch('indexdb/deleteProduct', prod.id))
    //     await Promise.all(storeProduct)
    //     this.$store.dispatch('indexdb/getProducts')
    //     this.doSearch({ start: this.start })
    //   } catch (err) {
    //     this.$message.error('Maaf gagal sync produk, silahkan coba lagi')
    //   } finally {
    //     this.loadingSync = false
    //   }
    // },

    generateDataProduct (req) {
      const formData = new FormData()
      const { image = {}, name = '', price = 0, unit = '', id = null, stock = 0, basePrice = 0, grocery = {} } = req
      const { originFileObj = '' } = image || {}
      const uniqueName = `${name} - ${unit}`
      const dataBody = { name, price, unit, uniqueName, id, stock: Number(stock), basePrice, grocery }
      if (originFileObj) {
        formData.append('files.images', originFileObj)
      }
      formData.append('data', JSON.stringify(this.$postWithAuth(dataBody)))
      return formData
    },

    // filterByShopId (arr) {
    //   const shopId = this.$strapi.$cookies.get('shop_id')
    //   return arr.filter(fil => fil.shop.id === shopId)
    // },

    // addBulkProductToIdb (products) {
    //   products.forEach((product) => {
    //     this.$store.dispatch('indexdb/addProduct', product)
    //   })
    // },
    refreshTable () {
      this.onCancel()
      this.doSearch({ start: this.start })
    },

    onPagination (current) {
      this.doSearch({ start: (current - 1) * this.limit })
    },
    onCancel () {
      this.visible = false
      this.dataEdit = null
    },
    async onDeleted () {
      try {
        this.$refs.tableUser.setLoading(true)
        const res = await this.$strapi.$users.find(this.$getAuthWithArea({ '_where[0][role.type_ne]': 'admin_area', '_where[1][role.type_ne]': 'super_admin' }))
        this.users = res
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui staff, silahkan refresh page')
      } finally {
        this.$refs.tableUser.setLoading(false)
      }
    },
    onEdit (row) {
      this.dataEdit = row
      this.visible = true
    },
    onCreate () {
      this.dataEdit = null
      this.visible = true
    },

    async doSearch ({ start = 0 }) {
      if (this.$nuxt.isOffline) {
        const searchProduct = this.$store.state.indexdb.products.filter((product) => {
          const uniqueName = product.uniqueName.toLowerCase()
          const searchText = this.search.toLowerCase()
          return uniqueName.includes(searchText)
        })
        this.products = searchProduct
        return
      }
      let users = []
      let totalUsers = 0
      try {
        this.$refs.tableUser.setLoading(true)
        const paramsWahanas = this.$getAuthWithArea({ username_contains: this.search, _start: start, _limit: 10, '_where[0][role.type_ne]': 'admin_area', '_where[1][role.type_ne]': 'super_admin' })
        const getUsers = this.$strapi.$users.find(paramsWahanas)
        const countUsers = this.$strapi.$users.count(this.$getAuthWithArea({ username_contains: this.search, '_where[0][role.type_ne]': 'admin_area', '_where[1][role.type_ne]': 'super_admin' }))
        const wrapRequest = [getUsers, countUsers]
        const res = await Promise.all(wrapRequest)
        users = res[0]
        // this.addBulkProductToIdb(products)
        totalUsers = res[1]
        this.start = start
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui staff, silahkan refresh page')
      } finally {
        setTimeout(() => {
          this.users = users
          this.total = totalUsers
          this.$refs.tableUser.setLoading(false)
        }, 300)
      }
    }
  }
})
</script>

<style lang="scss">
.container-home {
  button {
    margin: 10px 0;
  }
}
</style>
