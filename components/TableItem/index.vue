<template>
  <a-table :columns="columns" :data-source="data" row-key="id" :scroll="scroll" :loading="loading">
    <span slot="price" slot-scope="price, row">
      {{ `Rp. ${row.count * isUseGroceryPrice({ price: row.normalPrice || row.price, count: row.count, grocery: row.grocery || { price: null, minCount: null } })}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
    </span>
    <span slot="count" slot-scope="count, row, index">
      <a-space size="middle">
        <a-button
          v-if="row.onEdit"
          type="danger"
          shape="circle"
          icon="minus"
          size="default"
          :disabled="row.count === 0.25"
          @click="decrementCount(row, index)"
        />
        <span>{{ row.count }}</span>
        <a-button
          v-if="row.onEdit"
          type="primary"
          shape="circle"
          icon="plus"
          size="default"
          @click="incrementCount(row, index)"
        />
      </a-space>
    </span>
    <span
      slot="action"
      slot-scope="action, row, index"
      style="display: flex; justify-content: center; cursor: pointer; font-size: 20px;"
    >
      <a-space size="middle">
        <div>
          <a v-if="!row.onEdit" @click="onEdit(row, index, true)">
            <a-icon type="form" style="color: #1890ff; font-size: 15px;" />
          </a>
          <a v-else @click="onEdit(row, index, false)">
            <a-icon type="check-square" style="color: #1890ff; font-size: 15px;" />
          </a>
        </div>

        <a-popconfirm placement="topLeft" ok-text="Yes" cancel-text="No" @confirm="confirm(index)">
          <template slot="title">
            <p>Apa kamu yakin ingin delete produk ini?</p>
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
    dataIndex: 'count',
    key: 'count',
    title: 'Jumlah',
    scopedSlots: { customRender: 'count' },
    fixed: 'left'
  },
  {
    title: 'Nama Produk',
    dataIndex: 'productName',
    key: 'productName'
  },
  {
    title: 'Harga',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' },
    key: 'price'
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
    }
  },
  data () {
    return {
      loading: false,
      columns,
      scroll: {
        x: 400
      }
    }
  },
  methods: {
    onReviseCount (row, index) {
      const { count = 0, grocery = { minCount: null, price: null }, normalPrice = null, price = 0 } = row
      const newGrocery = grocery || { minCount: null, price: null }
      const newPrice = this.isUseGroceryPrice({ count, grocery: newGrocery, price: normalPrice || price })
      const newData = this.data
      row.price = Number(newPrice)
      newData.splice(index, 1, row)
      this.$emit('onEdit', newData)
    },

    incrementCount (row, index) {
      if (row.count === 0.5) {
        row.count = 1
      } else if (row.count === 0.25) {
        row.count = 0.5
      } else {
        row.count++
      }
      this.onReviseCount(row, index)
    },

    decrementCount (row, index) {
      if (row.count === 1) {
        row.count = 0.5
      } else if (row.count === 0.5) {
        row.count = 0.25
      } else {
        row.count--
      }
      this.onReviseCount(row, index)
    },

    onEdit (row, index, val) {
      row.onEdit = val
      const newData = this.data
      newData.splice(index, 1, row)
      this.$emit('onEdit', newData)
    },

    isUseGroceryPrice ({ count, grocery, price }) {
      if (Number(grocery.price) && Number(grocery.minCount)) {
        if (Number(grocery.minCount) <= Number(count)) {
          return grocery.price
        }
      }
      return price
    },

    doDelete (index) {
      const newData = [...this.data]
      newData.splice(index, 1)
      const reviseHistory = this.data.slice(index, this.data.length)
      this.$emit('onReviseHistory', reviseHistory)
      this.$emit('onEdit', newData)
    },

    confirm (index) {
      this.doDelete(index)
    }
  }
}
</script>
