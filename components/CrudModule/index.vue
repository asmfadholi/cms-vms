<template>
  <div class="container-product" :style="{ padding: '24px', background: '#fff', minHeight: '360px', margin: '16px 0' }">
    <div>
      <h1>
        <a-space size="small">
          <a-icon type="ordered-list" style="font-size: 15px;" />
          <span>List {{ feature }}</span>
        </a-space>
      </h1>
    </div>
    <a-divider />
    <a-row style="margin: 0 0 20px;">
      <a-col v-if="$accessElement(service).search" :span="12">
        <a-input
          v-model="search"
          v-debounce="doSearch"
          :placeholder="`Cari ${feature}`"
        />
      </a-col>
      <a-col :span="12">
        <div v-if="$accessElement(service).create" style="display: flex; justify-content: flex-end;">
          <a-button type="primary" icon="plus-circle" size="default" @click="onCreate">
            Tambah {{ feature }}
          </a-button>
        </div>
      </a-col>
    </a-row>

    <Table
      :ref="refTable"
      :data="list"
      :pagination="pagination"
      :custom-columns="customColumns"
      :service="service"
      :feature="feature"
      @onDeleted="onDeleted"
      @onEdit="onEdit"
      @onPagination="onPagination"
    />
    <a-modal
      class="modal-style"
      :mask-closable="false"
      :width="900"
      :title="dataEdit ? `Update ${feature}` : `Tambah ${feature}`"
      :visible="visible"
      :footer="null"
      @cancel="onCancel"
    >
      <LazyForm
        :filter-post="filterPost"
        :service="service"
        :feature="feature"
        :main-form="form"
        :data-edit="dataEdit"
        :other-fields="otherFields"
        @onEdited="refreshTable"
        @onCreated="refreshTable"
      />
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  scrollToTop: true,
  transition: 'slide-bottom',
  props: {
    form: {
      type: Array,
      default: () => []
    },
    customColumns: {
      type: Array,
      default: () => []
    },
    feature: {
      type: String,
      default: ''
    },
    refTable: {
      type: String,
      default: ''
    },
    filterPost: {
      type: Object,
      default: () => {}
    },
    filterGet: {
      type: Object,
      default: () => {}
    },
    needFormService: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 10
    },
    service: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      start: 0,
      list: [],
      total: 0,
      visible: false,
      search: '',
      dataEdit: null,
      otherFields: [],
      loading: false
    }
  },
  computed: {
    pagination () {
      return { current: (this.start / this.limit) + 1, total: this.total }
    }
  },
  mounted () {
    if (this.needFormService) { this.fillingForm() }
    this.doSearch({})
  },
  methods: {
    async getList (params = {}) {
      const { name_contains: nameContains = '' } = params
      const getList = this.$strapi[`$${this.service}`].find({ ...this.filterGet, ...params, _limit: this.limit })
      const countList = this.$strapi[`$${this.service}`].count({ ...this.filterGet, name_contains: nameContains })
      const wrapRequest = [getList, countList]
      const res = await Promise.all(wrapRequest)
      const list = res[0]
      const total = res[1]
      return { list, total }
    },

    async getFormArea () {
      const res = await this.$strapi.$forms.find(this.filterGet)
      return res[0] || {}
    },

    async fillingForm () {
      const { otherFields = [] } = await this.getFormArea()
      this.otherFields = otherFields
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
      try {
        this.$refs[this.refTable].setLoading(true)
        this.start = start
        const { list = [], total = 0 } = await this.getList({ name_contains: this.search, _start: this.start })
        this.list = list
        this.total = total
      } catch (err) {
        this.$message.error(`Maaf gagal perbaharui ${this.feature}, silahkan refresh page`)
      } finally {
        this.$refs[this.refTable].setLoading(false)
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
