<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="data"
      row-key="id"
      :scroll="scroll"
      :loading="loading"
      :pagination="pagination"
      @change="onChange"
    >
      <span slot="total" slot-scope="total">
        {{ `Rp. ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}
      </span>
      <!-- <span
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
            <p>Apa kamu yakin ingin delete produk ini?</p>
          </template>
          <a-icon type="delete" style="color: red; font-size: 15px;" />
        </a-popconfirm>
      </a-space>

    </span> -->
      <span slot="action" slot-scope="action, row">
        <a-space size="small">
          <a-button type="default" @click="doEdit(row)">Edit</a-button>
          <a-button type="primary" @click="doPrint(row)">Print</a-button>
        </a-space>
      </span>
      <span slot="createdAt" slot-scope="createdAt, row">
        <span>{{ createdAt || row.created_at | moment("DD MMM YYYY") }}</span>
        <br>
        <span class="time-zone-transaction">{{ createdAt || row.created_at | moment("HH:mm:ss") }} WIB</span>
      </span>
    </a-table>
    <a-modal
      class="modal-style"
      :mask-closable="false"
      title="Edit Transaksi"
      :visible="visible"
      :footer="null"
      @cancel="doCancel"
    >
      <FormTransaction :data-edit="dataEdit" @onEdited="onEdited" />
    </a-modal>
  </div>
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
    title: 'Nama',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left'
  },
  {
    title: 'Tanggal',
    dataIndex: 'createdAt',
    scopedSlots: { customRender: 'createdAt' },
    key: 'createdAt'
  },
  {
    title: 'Total',
    dataIndex: 'total',
    scopedSlots: { customRender: 'total' },
    key: 'total'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    key: 'action'
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
      visible: false,
      loading: false,
      dataEdit: null,
      columns,
      scroll: {
        x: 600
      }
    }
  },
  methods: {
    onChange (pagination) {
      const { current = 0 } = pagination
      this.$emit('onPagination', current)
    },

    setLoading (val) {
      this.loading = val
    },

    onEdited () {
      this.visible = false
      this.$emit('onEdited')
    },
    doEdit (row) {
      this.dataEdit = row
      this.visible = true
    },
    doCancel () {
      this.visible = false
    },
    generateStruk (req) {
      const { name, transactions, total, created_at: createdAtServer = new Date(), createdAt = '' } = req
      const nameUser = name.slice(0, 32)
      const convertMoney = val => `Rp.${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      const dataHitung = (nameData, totalData, price) => {
        const priceItem = convertMoney(String(price))
        const totalItems = convertMoney(String(Number(totalData) * price))
        const spaceTotal = 32 - (totalData.length + priceItem.length + 3) - totalItems.length
        const newData =
`${nameData}
${totalData} x ${priceItem}${[...new Array(spaceTotal)].map(() => ' ').join('')}${totalItems}`
        return newData
      }
      const totalMoney = convertMoney(String(total))
      const shopName = 'Toko H. Idoh'
      const zpl =
`${[...new Array(Math.ceil((32 - shopName.length) / 2))].map(() => ' ').join('')}${shopName}${[...new Array(Math.floor((32 - shopName.length) / 2))].map(() => ' ').join('')}

Nama Pelanggan : ${nameUser}
${this.$moment(createdAt || createdAtServer).format('DD MMM YYYY HH:mm')}
--------------------------------
${transactions.map(each => dataHitung(each.productName, String(each.count), each.price)).join('')}
--------------------------------
Total:${[...new Array(32 - totalMoney.length - 6)].map(() => ' ').join('')}${totalMoney}

--------- Terima Kasih ---------

`

      return zpl
    },

    writeStrToCharacteristic (str) {
      const buffer = new ArrayBuffer(str.length)
      const dataView = new DataView(buffer)
      for (let i = 0; i < str.length; i++) {
        dataView.setUint8(i, str.charAt(i).charCodeAt())
      }
      return this.$store.state.bluetooth.printCharacteristic.writeValue(buffer)
    },

    printData (req) {
      const zpl = this.generateStruk(req)
      const maxChunk = 20
      let j = 0

      if (zpl.length > maxChunk) {
        for (let i = 0; i < zpl.length; i += maxChunk) {
          let subStr
          if (i + maxChunk <= zpl.length) {
            subStr = zpl.substring(i, i + maxChunk)
          } else {
            subStr = zpl.substring(i, zpl.length)
          }

          setTimeout(this.writeStrToCharacteristic, 250 * j, subStr)
          j++
        }
      } else {
        setTimeout(() => {
          this.writeStrToCharacteristic(zpl)
        }, 1000)
      }
    },
    doPrint (req) {
      const { name } = req
      const This = this
      this.$confirm({
        title: `Print Struk "${name}"`,
        content: 'Apakah anda ingin print Struk Belanja?',
        okText: 'Ya, Print',
        cancelText: 'Tidak',
        onOk: async () => {
          if (!This.$store.state.bluetooth.printCharacteristic) {
            await this.$store.dispatch('bluetooth/connectToBluetooth')
            This.printData(req)
          } else {
            This.printData(req)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .time-zone-transaction {
    font-size: 10px;
  }
</style>
