<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px;" />
          <span>List Visitor</span>
        </a-space>
      </h1>
    </div>
    <a-divider />
    <a-row style="margin: 0 0 20px;">
      <a-col :span="12">
        <a-input
          v-model="search"
          v-debounce="doSearch"
          placeholder="Cari Nama Visitor"
        />
      </a-col>
      <a-col :span="12">
        <!-- <div style="display: flex; justify-content: flex-end;">
          <a-button type="primary" icon="plus-circle" size="default" @click="onCreate">
            Tambah Tiket
          </a-button>
        </div> -->
      </a-col>
    </a-row>

    <LazyTableVisitorArea
      ref="tableVisitors"
      :data="visitors"
      :pagination="pagination"
      @onDeleted="onDeleted"
      @onEdit="onEdit"
      @onPagination="onPagination"
    />
    <!-- <a-modal
      class="modal-style"
      :mask-closable="false"
      :title="dataEdit ? 'Update Tiket' : 'Tambah Tiket'"
      :visible="visible"
      :footer="null"
      @cancel="onCancel"
    >
      <LazyFormTicket :data-edit="dataEdit" :other-fields="otherFields" @onEdited="refreshTable" @onCreated="refreshTable" />
    </a-modal> -->
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
      const getVisitors = $strapi.$visitors.find($getAuthWithArea({ _start: 0, _limit: 10 }))
      const countVisitors = $strapi.$visitors.count($getAuthWithArea())
      const wrapRequest = [getVisitors, countVisitors]
      const res = await Promise.all(wrapRequest)
      const visitors = res[0]
      const total = res[1]
      return { visitors, total, start: 0, limit: 10 }
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
      visible: false,
      search: '',
      // dataEdit: null,
      loading: false
    }
  },
  computed: {
    pagination () {
      if (this.$nuxt.isOffline) { return {} }
      return { current: (this.start / this.limit) + 1, total: this.total }
    }
  },
  methods: {

    refreshTable () {
      // this.onCancel()
      this.doSearch({ start: this.start })
    },

    onPagination (current) {
      this.doSearch({ start: (current - 1) * this.limit })
    },
    // onCancel () {
    //   this.visible = false
    //   this.dataEdit = null
    // },
    onDeleted () {
      this.doSearch({ start: this.start })
    },
    // onEdit (row) {
    //   this.dataEdit = row
    //   this.visible = true
    // },
    // onCreate () {
    //   this.dataEdit = null
    //   this.visible = true
    // },

    async doSearch ({ start = 0 }) {
      let visitors = []
      let totalVisitors = 0
      try {
        this.$refs.tableVisitors.setLoading(true)
        const paramsVisitors = this.$getAuthWithArea({ name_contains: this.search, _start: start, _limit: 10 })
        const getVistors = this.$strapi.$visitors.find(paramsVisitors)
        const countVisitors = this.$strapi.$visitors.count(this.$getAuthWithArea({ name_contains: this.search }))
        const wrapRequest = [getVistors, countVisitors]
        const res = await Promise.all(wrapRequest)
        visitors = res[0]
        totalVisitors = res[1]
        this.start = start
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui visitor, silahkan refresh page')
      } finally {
        setTimeout(() => {
          this.visitors = visitors
          this.total = totalVisitors
          this.$refs.tableVisitors.setLoading(false)
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
