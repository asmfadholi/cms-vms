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
    <!-- <span slot="image" slot-scope="image">
      <img v-lazy="checkImage(image)" width="30px" height="30px" style="border-radius: 5px; object-fit: cover;">
    </span> -->
    <!-- <div slot="price" slot-scope="price" style="text-align: right;">
      {{ `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
    </div> -->
    <span
      slot="action"
      slot-scope="action, row"
      style="display: flex; justify-content: center; cursor: pointer; font-size: 20px;"
    >
      <!-- <a-space size="middle"> -->
      <!-- <a @click="onEdit(row)">
          <a-icon type="form" style="color: #1890ff; font-size: 15px;" />
        </a> -->
      <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm(row)">
        <template slot="title">
          <p>Apa kamu yakin ingin delete visitor ini?</p>
        </template>
        <a-icon type="delete" style="color: red; font-size: 15px;" />
      </a-popconfirm>
      <!-- </a-space> -->

    </span>
  </a-table>
</template>
<script>

const columns = [
  {
    dataIndex: 'bookingCode',
    key: 'bookingCode',
    title: 'Kode Booking',
    fixed: 'left'
  },
  {
    title: 'Nama',
    dataIndex: 'name',
    key: 'name',
    width: '130px',
    fixed: 'left'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Tanggal',
    dataIndex: 'createdAtByBe',
    key: 'createdAtByBe'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    key: 'action'
    // fixed: 'right'
  }
]

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      columns,
      scroll: {
        x: 600,
        scrollToFirstRowOnChange: true
      }
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
    async doDeleteVisitor (val) {
      this.loading = true
      try {
        await this.$strapi.$visitors.delete(val.id)
        this.$message.success('Berhasil menghapus visitor')
        await this.$emit('onDeleted')
      } catch (err) {
        this.$message.error('Maaf gagal menghapus visitor, silahkan coba lagi')
        setTimeout(() => {
          this.loading = false
        }, 300)
      }
    },
    confirm (val) {
      this.doDeleteVisitor(val)
    }
  }
}
</script>
