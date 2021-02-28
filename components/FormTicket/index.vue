<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="form-area-component"
  >
    <a-divider orientation="left">
      <span>Pilih Jadwal & Tiket</span>
    </a-divider>

    <a-form-model-item label="Jenis Tiket" prop="package">
      <a-select v-model="form.package" placeholder="Pilih Jenis Tiket" show-search>
        <a-select-option v-for="({ name, id }) in packages" :key="id">
          {{ name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <a-form-model-item label="Pilih Tanggal" prop="ticketDate">
      <a-date-picker
        v-model="form.ticketDate"
        format="DD MMM YYYY"
        :disabled-date="disabledDate"
      />
    </a-form-model-item>

    <a-divider orientation="left">
      <span>Identitas diri</span>
    </a-divider>

    <a-form-model-item ref="name" label="Nama" prop="name">
      <a-input
        v-model="form.name"
        placeholder="Tulis Namamu"
      />
    </a-form-model-item>
    <a-form-model-item ref="email" label="Email" prop="email">
      <a-input
        v-model="form.email"
        placeholder="Tulis Emailmu"
      />
    </a-form-model-item>
    <a-form-model-item ref="phoneNumber" label="No. Handphone" prop="phoneNumber">
      <a-input
        v-model="form.phoneNumber"
        type="number"
        placeholder="Tulis No. Handphonemu"
      />
    </a-form-model-item>
    <a-form-model-item label="Jenis Kelamin" prop="gender">
      <div>
        <a-radio-group v-model="form.gender">
          <a-radio value="laki-laki">
            Laki-laki
          </a-radio>
          <a-radio value="perempuan">
            Perempuan
          </a-radio>
        </a-radio-group>
      </div>
    </a-form-model-item>

    <!-- Part Dynamic Start -->

    <div>
      <a-divider v-if="newOtherFields.length > 0" orientation="left">
        <span>Informasi tambahan</span>
      </a-divider>
    </div>

    <a-form-model-item v-for="(field, idx) in newOtherFields" :key="idx" :label="field.label" :prop="`otherDatas.${field.prop}`">
      <template v-if="field.type === FORM_TYPE.CHECKBOX">
        <a-checkbox-group
          v-model="form.otherDatas[field.prop]"
          name="checkboxgroup"
          :options="generateOptions(field.options)"
        />
      </template>
      <template v-else-if="field.type === FORM_TYPE.RADIO">
        <a-radio-group v-model="form.otherDatas[field.prop]">
          <a-radio v-for="(option, opsIdx) in field.options" :key="opsIdx" :value="option">
            {{ option }}
          </a-radio>
        </a-radio-group>
      </template>
      <template v-else-if="field.type === FORM_TYPE.SELECT">
        <a-select
          v-model="form.otherDatas[field.prop]"
          :placeholder="field.label"
          allow-clear
        >
          <a-select-option v-for="(option, opsIdx) in field.options" :key="opsIdx" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </template>
      <template v-else-if="field.type === FORM_TYPE.SHORT_TEXT">
        <a-input
          v-model="form.otherDatas[field.prop]"
          :placeholder="field.label"
        />
      </template>
      <template v-else-if="field.type === FORM_TYPE.LONG_TEXT">
        <a-textarea
          v-model="form.otherDatas[field.prop]"
          :placeholder="field.label"
        />
      </template>
      <template v-else-if="field.type === FORM_TYPE.NUMBER">
        <a-input
          v-model.number="form.otherDatas[field.prop]"
          type="number"
          :placeholder="field.label"
        />
      </template>
    </a-form-model-item>

    <!-- Part Dynamic End -->

    <a-form-model-item :style="{ textAlign: 'center' }">
      <a-button type="primary" :loading="loadingForm" @click="onSubmit">
        {{ dataEdit ? 'Edit' : 'Tambahkan' }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Vue from 'vue'
import { FORM_TYPE } from '@/constants'
import moment from 'moment'

export default Vue.extend({
  props: {
    dataEdit: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      packages: [],
      FORM_TYPE,
      otherFields: [],
      loadingForm: false,
      newOtherFields: [],
      defaultForm: {},
      form: {
        package: undefined,
        name: '',
        gender: '',
        email: '',
        phoneNumber: '',
        ticketDate: null,
        isCheckin: true
      },
      rules: {
        ticketDate: [
          { required: true, message: 'Field is required', trigger: 'change' }
        ],
        package: [
          { required: true, message: 'Field is required', trigger: 'change' }
        ],
        name: [
          { required: true, message: 'Field is required', trigger: 'change' }
        ],
        gender: [{ required: true, message: 'Field is required', trigger: 'change' }],
        email: [
          { required: true, message: 'Field is required', trigger: 'change' },
          { type: 'email', message: 'Must be of type email', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: 'Field is required', trigger: 'change' },
          { min: 8, max: 15, message: 'Length should be 8 to 15', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    dataEdit (newVal) {
      if (newVal) {
        this.setDataEdit(newVal)
      } else {
        this.resetForm()
      }
    }
  },
  async created () {
    this.getPackages()
    const { otherFields = [] } = await this.getFormArea()
    this.otherFields = otherFields
    this.generateForm(this.otherFields)
  },
  methods: {
    setDataEdit (newVal) {
      this.form = { ...newVal, package: newVal.package?.id || 0 }
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    },
    async getFormArea () {
      const res = await this.$strapi.$forms.find(this.$getAuthWithArea())
      return res[0] || {}
    },
    async getPackages () {
      const res = await this.$strapi.$packages.find(this.$getAuthWithArea())
      this.packages = res
    },

    resetForm () {
      this.form = { ...this.defaultForm }
    },

    async createTicket () {
      this.loadingForm = true
      try {
        await this.$strapi.$tickets.create(this.$postAuthWithArea(this.form))
        this.$message.success('Berhasil menambah tiket')
        this.resetForm()
        this.$emit('onCreated')
      } catch (err) {
        this.$message.error('Gagal menambah Tiket, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    async editTicket () {
      this.loadingForm = true
      try {
        await this.$strapi.$tickets.update(this.dataEdit?.id || 0, this.$postAuthWithArea(this.form))
        this.$message.success('Berhasil edit tiket')
        this.resetForm()
        this.$emit('onEdited')
      } catch (err) {
        this.$message.error('Gagal edit Tiket, silahkan coba lagi')
      } finally {
        this.loadingForm = false
      }
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dataEdit) {
            this.editTicket()
          } else {
            this.createTicket()
          }
        } else {
          return this.$message.error('Silahkan lengkapi data terlebih dahulu')
        }
      })
    },
    generateOptions (valuesOps = []) {
      return valuesOps.map(val => ({ label: val, value: val }))
    },
    capitalize (val) {
      return val.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()).replace(/ /g, '')
    },
    generateForm (otherFields) {
      const newRules = { ...this.rules, otherDatas: {} }
      const newForm = { ...this.form, otherDatas: {} }
      const newOtherFields = [...otherFields]
      otherFields.forEach(({ label = '', isRequired = false, type = '' }, idx) => {
        const newLabel = this.capitalize(label)

        newForm.otherDatas[newLabel] = type === FORM_TYPE.CHECKBOX ? [] : ''
        if (isRequired) {
          newRules.otherDatas[newLabel] = [
            { required: true, message: 'Field is required', trigger: 'change' }
          ]
        }
        newOtherFields[idx].prop = newLabel
      })
      this.rules = { ...newRules }
      this.form = { ...newForm }
      this.defaultForm = { ...newForm }
      this.newOtherFields = newOtherFields
    }
  }
})
</script>
