<template>
  <div class="form-transaction-component">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="form-area-component"
    >
      <a-form-model-item ref="name" label="Nama Pelanggan" prop="name">
        <a-input
          v-model="form.name"
          placeholder="Tulis Nama"
        />
      </a-form-model-item>
      <a-form-model-item label="Cari Produk di sini">
        <div style="display: flex; justify-content: center;">
          <a-space size="middle">
            <a-button
              type="danger"
              shape="circle"
              icon="minus"
              size="default"
              :disabled="count === 0.25"
              @click="decrementCount"
            />
            <span>{{ count }}</span>
            <a-button type="primary" shape="circle" icon="plus" size="default" @click="incrementCount" />
          </a-space>
        </div>
        <div class="add-product">
          <a-row>
            <a-col :sm="24" :md="20" style="margin-bottom: 10px;">
              <a-select
                v-model="search"
                v-debounce="doSearch"
                class="select-product"
                show-search
                placeholder="Cari produk disini"
                style="width: 100%; height: 60px;"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                not-found-content="Produk tidak ditemukan"
                @search="onChangeSearch"
              >
                <a-select-option v-for="d in productOptions" :key="JSON.stringify(d)">
                  <a-space size="middle">
                    <img v-lazy="checkImage(d.image)" height="50px" width="50px" style="object-fit: cover; border-radius: 5px;">
                    <span>
                      {{ d.uniqueName }}
                    </span>
                  </a-space>
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :sm="24" :md="4">
              <a-button type="primary" size="default" style="margin: 0; width: 100%; height: 60px;" @click="addProduct">
                Add
              </a-button>
            </a-col>
          </a-row>
        </div>
      </a-form-model-item>

      <div v-if="transactions.length > 0">
        <div>
          Total: <b class="total-price-label">Rp. {{ String(totalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}</b>
        </div>
        <TableItem :data="transactions" @onEdit="(val) => transactions = val" @onReviseHistory="onReviseHistory" />
      </div>

      <a-form-model-item>
        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="onSubmit">
          <template slot="title">
            <p>Apa kamu yakin ingin {{ !dataEdit ? 'membuat' : 'Edit' }} transaksi sekarang?</p>
          </template>
          <a-button type="primary" :loading="loadingForm">
            {{ !dataEdit ? 'Submit' : 'Edit' }}
          </a-button>
        </a-popconfirm>

        <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="resetForm">
          <template slot="title">
            <p>Apa kamu yakin ingin mereset formulir?</p>
          </template>
          <a-button style="margin-left: 10px;">
            Reset
          </a-button>
        </a-popconfirm>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import Vue from 'vue'
import TableItem from '@/components/TableItem'

export default Vue.extend({
  components: {
    TableItem
  },
  props: {
    model: {
      type: String,
      default: ''
    },
    dataEdit: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      count: 1,
      showScan: false,
      countTrain: 5,
      currentStream: '',
      label: '',
      historyAdded: {},
      querySearch: '',
      transactions: [],
      productOptions: [],
      currentProduct: null,
      isSetProduk: false,
      offsetVideo: 0,
      loadingScan: false,
      predict: '',
      search: '',
      capturing: false,
      visible: false,
      loadingForm: false,
      loadingInit: false,
      loadingModel: false,
      form: {
        name: null,
        count: 1
      },
      rules: {
        name: [{ required: true, message: 'Field is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    totalPrice () {
      let totalPrice = 0
      this.transactions.forEach((item) => {
        totalPrice += (Number(item.price) * Number(item.count))
      })
      return totalPrice
    },
    db () {
      return this.$store.state.indexdb.db
    }
  },
  watch: {
    dataEdit (newVal) {
      if (newVal) {
        const { name = '', transactions = '' } = newVal
        this.form.name = name
        this.transactions = transactions
      }
    }
  },
  async created () {
    if (this.$nuxt.isOffline && this.db) {
      await this.$store.dispatch('indexdb/getProducts')
      this.productOptions = this.$store.state.indexdb.products.slice(0, 15)
    } else {
      this.doSearch()
    }
    if (this.dataEdit) {
      const { name = '', transactions = '' } = this.dataEdit
      this.form.name = name
      this.transactions = transactions
    }
  },
  methods: {
    decrementCount () {
      if (this.count === 1) {
        this.count = 0.5
        return
      } else if (this.count === 0.5) {
        this.count = 0.25
        return
      }
      this.count--
    },

    incrementCount () {
      if (this.count === 0.5) {
        this.count = 1
        return
      } else if (this.count === 0.25) {
        this.count = 0.5
        return
      }
      this.count++
    },

    onReviseHistory (val) {
      val.forEach(({ productName }, index) => {
        if (Number(index) === 0) {
          this.historyAdded[productName] = -1
        } else {
          this.historyAdded[productName] -= 1
        }
      })
    },

    isUseGroceryPrice ({ count, grocery, price }) {
      if (grocery.price && grocery.minCount) {
        if (Number(grocery.minCount) <= Number(count)) {
          return grocery.price
        }
      }
      return price
    },

    addProduct () {
      if (!this.search) { return }
      const { price = 0, uniqueName = '', grocery, basePrice = 0, productId = null } = JSON.parse(this.search) || {}
      const newGrocery = grocery || { price: 0, minCount: 0 }
      let newPrice = this.isUseGroceryPrice({ price, count: this.count, grocery: newGrocery })

      const indexAddedProduct = Number(this.historyAdded[uniqueName])
      if (indexAddedProduct >= 0) {
        const newCount = this.transactions[indexAddedProduct].count + this.count
        this.transactions[indexAddedProduct].count = newCount
        newPrice = this.isUseGroceryPrice({ price, count: newCount, grocery: newGrocery })
        this.transactions[indexAddedProduct].price = newPrice
      } else {
        this.transactions.push({ productName: uniqueName, price: Number(newPrice), count: this.count, __component: 'transaction.transaction', normalPrice: Number(price), grocery: newGrocery, basePrice, productId })
        this.historyAdded[uniqueName] = this.transactions.length - 1
      }
      this.search = ''
      this.count = 1
    },

    onChangeSearch (val) {
      this.querySearch = val
    },

    checkImage (img) {
      const { url = '' } = img || {}
      return this.$generateUrl(url || '')
    },

    async doSearch () {
      if (this.$nuxt.isOffline) {
        const searchProduct = this.$store.state.indexdb.products.filter((product) => {
          const unique = product.uniqueName || ''
          const uniqueName = unique.toLowerCase()
          const searchText = this.querySearch.toLowerCase()
          return uniqueName.includes(searchText)
        })
        this.productOptions = searchProduct.slice(0, 15)
        return
      }
      try {
        const req = this.$getWithAuth({ uniqueName_contains: this.querySearch, _limit: 20 })
        const res = await this.$strapi.$products.find(req)
        this.productOptions = res
      } catch (err) {
        this.$message.error('Maaf gagal perbaharui produk, silahkan refresh page')
      }
    },

    async doGetProduct (val) {
      this.loadingScan = true
      if (this.productList[val]) {
        this.currentProduct = this.productList[val]
      }
      try {
        const req = this.$getWithAuth({ name: val })
        const [res = null] = await this.$strapi.$products.find(req)
        if (!res) {
          this.$message.error('Produk tidak ditemukan')
        } else {
          this.isSetProduk = true
          this.productList[val] = res
          this.currentProduct = res
          this.form.count = 1
        }
      } catch (err) {
        this.$message.error('Gagal mencari produk, silahkan coba lagi')
      } finally {
        this.loadingScan = false
      }
    },

    openScanner () {
      this.visible = true
    },

    onCancel () {
      this.countTrain = 5
      this.visible = false
      this.loadingForm = false
    },

    checkCount () {
      const currentCount = this.countTrain - 1
      if (currentCount === 0) {
        this.saveModel()
      } else {
        this.countTrain = currentCount
      }
    },

    generateDataTransaction () {
      let totalPrice = 0
      this.transactions.forEach((item) => {
        totalPrice += (item.price * item.count)
      })
      const req = {
        createdAt: new Date(),
        name: this.form.name,
        total: totalPrice,
        transactions: this.transactions
      }
      return this.$postWithAuth(req)
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

Nama Pelanggan: ${nameUser}
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
        this.writeStrToCharacteristic(zpl)
      }
    },

    async doCreateTransaction () {
      this.loadingForm = true
      const req = this.generateDataTransaction()
      try {
        if (this.$nuxt.isOffline) {
          req.id = String(Date.now())
          req.action = 'create'
          await this.$store.dispatch('indexdb/addTransaction', req)
          await this.$store.dispatch('indexdb/getTransactions')
        } else {
          await this.$strapi.$transactions.create(req)
        }
        this.$message.success('Transaksi berhasil dibuat')
        const This = this
        this.$confirm({
          title: 'Print Struk',
          content: 'Apakah anda ingin print Struk Belanja?',
          okText: 'Ya, Print',
          cancelText: 'Tidak',
          onOk: async () => {
            if (!This.$store.state.bluetooth.printCharacteristic) {
              try {
                await this.$store.dispatch('bluetooth/connectToBluetooth')
                This.printData(req)
              } finally {
                This.$router.push('/dashboard/transaction')
              }
            } else {
              This.printData(req)
            }
          },
          onCancel: () => {
            This.$router.push('/dashboard/transaction')
          }
        })
        this.$router.push('/dashboard/transaction')
      } catch (err) {
        this.$message.error('gagal membuat transaksi, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    async doEditTransaction () {
      this.loadingForm = true
      const req = this.generateDataTransaction()
      try {
        await this.$strapi.$transactions.update(this.dataEdit?.id || 0, req)
        this.$message.success('Transaksi berhasil Diupdate')
        this.$emit('onEdited')
      } catch (err) {
        this.$message.error('gagal update transaksi, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dataEdit) {
            this.doEditTransaction()
            return
          }
          this.loadingForm = true
          if (this.transactions.length === 0) {
            this.loadingForm = false
            return this.$message.error('Tidak ada produk yang di beli, silahkan tambahkan produk')
          }
          this.doCreateTransaction()
        } else {
          return this.$message.error('Silahkan lengkapi data terlebih dahulu')
        }
      })
    },

    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.transactions = []
    }
  }
})
</script>

<style lang="scss">
.form-transaction-component {
  .add-product .ant-space {
    width: 100% !important;

    .ant-space-item:first-child {
      width: 100% !important;
    }
  }

  .total-price-label {
    font-size: 25px;
  }

  .add-product .select-product .ant-select-selection--single {
    height: 60px !important;

    .ant-select-selection__rendered {
      margin-top: 4px !important;
    }
  }
}
</style>
