<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px;" />
          <span>List Produk</span>
          <a-button v-if="dataSync.length > 0" type="default" :loading="loadingSync" @click="syncData">
            Sync
          </a-button>
        </a-space>
      </h1>
    </div>
    <a-divider />
    <a-row style="margin: 0 0 20px;">
      <a-col :span="12">
        <a-input
          v-model="search"
          v-debounce="doSearch"
          placeholder="Cari Produk"
        />
      </a-col>
      <a-col :span="12">
        <div style="display: flex; justify-content: flex-end;">
          <nuxt-link to="product/add">
            <a-button type="primary" icon="plus-circle" size="default">
              Tambah Produk
            </a-button>
          </nuxt-link>
        </div>
      </a-col>
    </a-row>

    <LazyTableProduct
      ref="tableProduct"
      :data="products || productList"
      :pagination="pagination"
      @onDeleted="onDeleted"
      @onEdit="onEdit"
      @onPagination="onPagination"
    />
    <a-modal
      class="modal-style"
      :mask-closable="false"
      title="Edit Produk"
      :visible="visible"
      :footer="null"
      @cancel="onCancel"
    >
      <LazyFormProduct :data-edit="dataEdit" @onEdited="onEdited" />
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
  async asyncData ({ $strapi, $getWithAuth, redirect, $cookies }) {
    try {
      const getProducts = $strapi.$products.find($getWithAuth({ _start: 0, _limit: 10 }))
      const countProducts = $strapi.$products.count($getWithAuth())
      const wrapRequest = [getProducts, countProducts]
      const res = await Promise.all(wrapRequest)
      const productList = res[0]
      const totalProducts = res[1]
      return { productList, totalProducts, start: 0, limit: 10, noError: true }
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
      products: null,
      visible: false,
      search: '',
      dataEdit: null,
      productList: [],
      testPage: 1,
      testTotal: null,
      loading: false
    }
  },
  computed: {
    pagination () {
      if (this.$nuxt.isOffline) { return {} }
      return { current: (this.start / this.limit) + 1, total: this.totalProducts }
    },
    db () {
      return this.$store.state.indexdb.db
    },
    dataSync () {
      return this.$store.state.indexdb.products.filter(fil => typeof fil.id === 'string')
    }
  },
  async created () {
    if (process.server) { return }
    await this.$store.dispatch('indexdb/getProducts')
    if (this.$nuxt.isOffline && this.db) {
      this.products = this.$store.state.indexdb.products
    } else {
      this.addBulkProductToIdb(this.productList)
    }
  },
  mounted () {
    if (!this.noError) {
      this.$message.error(this.$nuxt.isOffline ? 'Mode Offline' : 'Gagal memuat data, silahkan refresh page')
    }
  },
  methods: {
    async syncDataHard () {
      this.loadingSync = true
      let countProducts = this.testTotal
      if (!countProducts) {
        countProducts = await this.$strapi.$products.count(this.$getWithAuth())
        this.testTotal = countProducts
      }
      const paramsProducts = this.$getWithAuth({ _start: (this.testPage - 1) * 50, _limit: 50 })
      const getProducts = await this.$strapi.$products.find(paramsProducts)

      const containerProducts = getProducts.filter(fil => !fil.productId).map(prod => this.$strapi.update('products', prod.id || 0, { productId: this.$uuid() }))
      await Promise.all(containerProducts)
      const isContinue = Math.ceil(countProducts / 50) >= this.testPage
      if (isContinue) {
        this.testPage++
        this.syncDataHard()
      } else {
        this.loadingSync = false
      }
    },

    async syncData () {
      const dataProducts = this.dataSync
      try {
        this.loadingSync = true
        const storeCreateProducts = dataProducts.map(prod => this.$strapi.$products.create(this.generateDataProduct(prod)))
        await Promise.all(storeCreateProducts)
        const storeProduct = dataProducts.map(prod => this.$store.dispatch('indexdb/deleteProduct', prod.id))
        await Promise.all(storeProduct)
        this.$store.dispatch('indexdb/getProducts')
        this.doSearch({ start: this.start })
      } catch (err) {
        this.$message.error('Maaf gagal sync produk, silahkan coba lagi')
      } finally {
        this.loadingSync = false
      }
    },

    generateDataProduct (req) {
      const formData = new FormData()
      const { image = {}, name = '', price = 0, unit = '', id = null, stock = 0, basePrice = 0, grocery = {} } = req
      const { originFileObj = '' } = image || {}
      const uniqueName = `${name} - ${unit}`
      const dataBody = { name, price, unit, uniqueName, id, stock: Number(stock), basePrice, grocery }
      if (originFileObj) {
        formData.append('files.image', originFileObj)
      }
      formData.append('data', JSON.stringify(this.$postWithAuth(dataBody)))
      return formData
    },

    filterByShopId (arr) {
      const shopId = this.$strapi.$cookies.get('shop_id')
      return arr.filter(fil => fil.shop.id === shopId)
    },

    addBulkProductToIdb (products) {
      products.forEach((product) => {
        this.$store.dispatch('indexdb/addProduct', product)
      })
    },
    onEdited () {
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
        this.$refs.tableProduct.setLoading(true)
        const res = await this.$strapi.$products.find(this.$getWithAuth())
        this.products = res
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
      } finally {
        this.$refs.tableProduct.setLoading(false)
      }
    },
    onEdit (row) {
      this.dataEdit = row
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
      let products = []
      let totalProducts = 0
      try {
        this.$refs.tableProduct.setLoading(true)
        const paramsProducts = this.$getWithAuth({ uniqueName_contains: this.search, _start: start, _limit: 10 })
        const getProducts = this.$strapi.$products.find(paramsProducts)
        const countProducts = this.$strapi.$products.count(this.$getWithAuth({ uniqueName_contains: this.search }))
        const wrapRequest = [getProducts, countProducts]
        const res = await Promise.all(wrapRequest)
        products = res[0]
        this.addBulkProductToIdb(products)
        totalProducts = res[1]
        this.start = start
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
      } finally {
        setTimeout(() => {
          this.products = products
          this.totalProducts = totalProducts
          this.$refs.tableProduct.setLoading(false)
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
