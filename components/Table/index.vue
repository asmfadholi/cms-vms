<template>
  <a-table
    :columns="columns"
    :data-source="data"
    row-key="id"
    :scroll="scroll"
    :loading="loading"
    :pagination="pagination"
    @change="onChange"
  >
    <span
      slot="action"
      slot-scope="action, row"
      style="display: flex; justify-content: center; cursor: pointer; font-size: 20px;"
    >
      <a-space size="middle">
        <a @click="onEdit(row)">
          <a-icon type="form" style="color: #1890ff; font-size: 15px;" />
        </a>
        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm(row)">
          <template slot="title">
            <p>Apa kamu yakin ingin delete {{ feature }} ini?</p>
          </template>
          <a-icon type="delete" style="color: red; font-size: 15px;" />
        </a-popconfirm>
      </a-space>

    </span>
  </a-table>
</template>
<script>

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    customColumns: {
      type: Array,
      default: () => []
    },
    feature: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      scroll: {
        x: 600,
        scrollToFirstRowOnChange: true
      }
    }
  },
  computed: {
    columns () {
      return [
        ...this.customColumns,
        {
          title: 'Action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          key: 'action'
        }
      ]
    }
  },
  methods: {
    onChange (pagination) {
      const { current = 0 } = pagination
      this.$emit('onPagination', current)
    },
    onEdit (row) {
      this.$emit('onEdit', row)
    },
    setLoading (val) {
      this.loading = val
    },
    async doDelete (val) {
      this.loading = true
      try {
        await this.$strapi[`$${this.service}`].delete(val.id)
        this.$message.success(`Berhasil menghapus ${this.feature}`)
        await this.$emit('onDeleted')
      } catch (err) {
        this.$message.error(`Maaf gagal menghapus ${this.feature}, silahkan coba lagi`)
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 300)
      }
    },
    confirm (val) {
      this.doDelete(val)
    }
  }
}
</script>
