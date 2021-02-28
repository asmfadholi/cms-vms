<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px;" />
          <span>List Tiket</span>
        </a-space>
      </h1>
    </div>
    <a-divider />
    <a-row style="margin: 0 0 20px;">
      <a-col :span="12">
        <a-input
          v-model="search"
          v-debounce="doSearch"
          placeholder="Cari Tiket"
        />
      </a-col>
      <a-col :span="12">
        <div style="display: flex; justify-content: flex-end;">
          <a-button type="primary" icon="plus-circle" size="default" @click="onCreate">
            Tambah Tiket
          </a-button>
        </div>
      </a-col>
    </a-row>

    <LazyTableTicket
      ref="tableTicket"
      :data="tickets"
      :pagination="pagination"
      @onDeleted="onDeleted"
      @onEdit="onEdit"
      @onPagination="onPagination"
    />
    <a-modal
      class="modal-style"
      :mask-closable="false"
      :title="dataEdit ? 'Update Tiket' : 'Tambah Tiket'"
      :visible="visible"
      :footer="null"
      @cancel="onCancel"
    >
      <LazyFormTicket :data-edit="dataEdit" :other-fields="otherFields" @onEdited="refreshTable" @onCreated="refreshTable" />
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
      const getTickets = $strapi.$tickets.find($getAuthWithArea({ _start: 0, _limit: 10 }))
      const countTickets = $strapi.$tickets.count($getAuthWithArea())
      const wrapRequest = [getTickets, countTickets]
      const res = await Promise.all(wrapRequest)
      const tickets = res[0]
      const total = res[1]
      return { tickets, total, start: 0, limit: 10 }
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
      dataEdit: null,
      otherFields: [],
      loading: false
    }
  },
  computed: {
    pagination () {
      if (this.$nuxt.isOffline) { return {} }
      return { current: (this.start / this.limit) + 1, total: this.total }
    }
  },
  async created () {
    const { otherFields = [] } = await this.getFormArea()
    this.otherFields = otherFields
  },
  methods: {
    async getFormArea () {
      const res = await this.$strapi.$forms.find(this.$getAuthWithArea())
      return res[0] || {}
    },

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
    onDeleted () {
      this.doSearch({ start: this.start })
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
      let tickets = []
      let totalTickets = 0
      try {
        this.$refs.tableTicket.setLoading(true)
        const paramstickets = this.$getAuthWithArea({ name_contains: this.search, _start: start, _limit: 10 })
        const getTickets = this.$strapi.$tickets.find(paramstickets)
        const countTickets = this.$strapi.$tickets.count(this.$getAuthWithArea({ name_contains: this.search }))
        const wrapRequest = [getTickets, countTickets]
        const res = await Promise.all(wrapRequest)
        tickets = res[0]
        totalTickets = res[1]
        this.start = start
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui tiket, silahkan refresh page')
      } finally {
        setTimeout(() => {
          this.tickets = tickets
          this.total = totalTickets
          this.$refs.tableTicket.setLoading(false)
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
