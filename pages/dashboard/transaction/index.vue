<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px;" />
          <span>List Transaksi</span>
          <a-button v-if="dataSync.length > 0" type="default" :loading="loadingSync" @click="syncData">
            Sync
          </a-button>
        </a-space>
      </h1>
    </div>
    <a-divider />
    <div style="display: flex; justify-content: flex-end; margin: 20px 0;">
      <nuxt-link to="/dashboard/transaction/add">
        <a-button type="primary" icon="plus-circle" size="default">
          Buat transaksi
        </a-button>
      </nuxt-link>
    </div>
    <TableTransaction
      ref="tableTransaction"
      :data="transactions || transactionList"
      :pagination="pagination"
      :loading="loading"
      @onDeleted="onDeleted"
      @onEdited="onEdited"
      @onPagination="onPagination"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import TableTransaction from '@/components/TableTransaction'

export default Vue.extend({
  components: {
    TableTransaction
  },
  layout: 'dashboard',
  middleware: 'auth',
  scrollToTop: true,
  transition: 'slide-bottom',
  async asyncData ({ $strapi, $getWithAuth, redirect, $cookies }) {
    try {
      const getTransactions = $strapi.$transactions.find($getWithAuth({ _start: 0, _limit: 10 }))
      const countTransactions = $strapi.$transactions.count($getWithAuth())
      const wrapRequest = [getTransactions, countTransactions]
      const res = await Promise.all(wrapRequest)
      const transactionList = res[0] || []
      const totalTransactions = res[1]
      return { transactionList, totalTransactions, start: 0, limit: 10, noError: true }
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
      transactions: null,
      search: '',
      loadingSync: false,
      transactionList: [],
      loading: false
    }
  },
  computed: {
    pagination () {
      if (this.$nuxt.isOffline) { return {} }
      return { current: (this.start / this.limit) + 1, total: this.totalTransactions }
    },
    db () {
      return this.$store.state.indexdb.db
    },
    dataSync () {
      return this.$store.state.indexdb.transactions.filter(fil => typeof fil.id === 'string')
    }
  },
  async created () {
    if (process.server) { return }
    await this.$store.dispatch('indexdb/getTransactions')
    if (this.$nuxt.isOffline && this.db) {
      this.transactions = this.$store.state.indexdb.transactions
    } else {
      this.addBulkTransactionsToIdb(this.transactionList)
    }
  },
  mounted () {
    if (!this.noError) {
      this.$message.error(this.$nuxt.isOffline ? 'Mode Offline' : 'Gagal memuat data, silahkan refresh page')
    }
  },
  methods: {

    async syncData () {
      const dataTransactions = this.dataSync
      try {
        this.loadingSync = true
        const storeCreateTransactions = dataTransactions.map(prod => this.$strapi.$transactions.create(prod))
        await Promise.all(storeCreateTransactions)
        const storeTransactions = dataTransactions.map(prod => this.$store.dispatch('indexdb/deleteTransaction', prod.id))
        await Promise.all(storeTransactions)
        this.$store.dispatch('indexdb/getTransactions')
        this.doSearch({ start: this.start })
      } catch (err) {
        this.$message.error('Maaf gagal sync produk, silahkan coba lagi')
      } finally {
        this.loadingSync = false
      }
    },

    filterByShopId (arr) {
      const shopId = this.$strapi.$cookies.get('shop_id')
      return arr.filter(fil => fil.shop.id === shopId)
    },

    addBulkTransactionsToIdb (transactions) {
      transactions.forEach((transaction) => {
        this.$store.dispatch('indexdb/addTransaction', transaction)
      })
    },

    onPagination (current) {
      this.doSearch({ start: (current - 1) * this.limit })
    },

    async doSearch ({ start = 0 }) {
      if (this.$nuxt.isOffline) {
        const searchTransaction = this.$store.state.indexdb.transactions.filter((transaction) => {
          const uniqueName = transaction.name.toLowerCase()
          const searchText = this.search.toLowerCase()
          return uniqueName.includes(searchText)
        })
        this.transactions = searchTransaction
        return
      }
      let transactions = []
      let totalTransactions = 0
      try {
        this.$refs.tableTransaction.setLoading(true)
        const paramsProducts = this.$getWithAuth({ name_contains: this.search, _start: start, _limit: 10 })
        const getProducts = this.$strapi.$transactions.find(paramsProducts)
        const countProducts = this.$strapi.$transactions.count(this.$getWithAuth({ name_contains: this.search }))
        const wrapRequest = [getProducts, countProducts]
        const res = await Promise.all(wrapRequest)
        transactions = res[0]
        this.addBulkTransactionsToIdb(transactions)
        totalTransactions = res[1]
        this.start = start
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui transaksi, silahkan refresh page')
      } finally {
        setTimeout(() => {
          this.transactions = transactions
          this.totalProducts = totalTransactions
          this.$refs.tableTransaction.setLoading(false)
        }, 300)
      }
    },

    async refreshTable () {
      try {
        this.loading = true
        const res = await this.$strapi.$transactions.find(this.$getWithAuth())
        this.transactionList = res
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui transaksi, silahkan refresh page')
      } finally {
        this.loading = false
      }
    },

    onEdited () {
      this.refreshTable()
    },

    onDeleted () {
      this.refreshTable()
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
