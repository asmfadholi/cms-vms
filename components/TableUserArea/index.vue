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
      <a-space size="middle">
        <a @click="onEdit(row)">
          <a-icon type="form" style="color: #1890ff; font-size: 15px;" />
        </a>
        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm(row)">
          <template slot="title">
            <p>Apa kamu yakin ingin delete staff ini?</p>
          </template>
          <a-icon type="delete" style="color: red; font-size: 15px;" />
        </a-popconfirm>
      </a-space>

    </span>
  </a-table>
</template>
<script>

const columns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    fixed: 'left'
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: '130px',
    fixed: 'left'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Role',
    dataIndex: 'role.name',
    key: 'role.name'
  },
  // {
  //   title: 'Area',
  //   dataIndex: 'stock',
  //   key: 'stock'
  // },
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
    checkImage (img) {
      const { url = '' } = img || {}
      return this.$generateUrl(url || '')
    },
    async doDeleteUser (val) {
      this.loading = true
      try {
        await this.$strapi.$users.delete(val.id)
        // await this.$store.dispatch('indexdb/deleteProduct', val.id)
        this.$message.success('Berhasil menghapus staff')
        await this.$emit('onDeleted')
      } catch (err) {
        this.$message.error('Maaf gagal menghapus staff, silahkan coba lagi')
        setTimeout(() => {
          this.loading = false
        }, 300)
      }
    },
    confirm (val) {
      this.doDeleteUser(val)
    }
  }
}
</script>
