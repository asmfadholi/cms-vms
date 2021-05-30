<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    class="form-area-component"
  >
    <template v-for="({ title, form: formProp }, idxTitle) in mainForm">
      <div :key="`title${idxTitle}`">
        <a-divider orientation="left">
          <span>{{ title }}</span>
        </a-divider>
        <a-form-model-item v-for="({ label, prop, type, options, disabledDate, placeholder }, idForm) in formProp" :key="`form${idForm}`" :label="label" :prop="prop">
          <template v-if="type === FORM_TYPE.CHECKBOX">
            <a-checkbox-group
              v-model="form[prop]"
              name="checkboxgroup"
              :options="generateOptions(options)"
            />
          </template>
          <template v-else-if="type === FORM_TYPE.MULTI_UPLOAD || type === FORM_TYPE.SINGLE_UPLOAD">
            <UploadImageNew v-model="form[prop]" :multiple="type === FORM_TYPE.MULTI_UPLOAD" />
          </template>
          <template v-else-if="type === FORM_TYPE.DATE">
            <a-date-picker
              v-model="form[prop]"
              :style="{ width: '100%' }"
              format="DD MMM YYYY"
              :disabled-date="disabledDate"
            />
          </template>
          <template v-else-if="type === FORM_TYPE.RADIO">
            <a-radio-group v-model="form[prop]">
              <a-radio v-for="({ name, id }, opsIdx) in options" :key="opsIdx" :value="id">
                {{ name }}
              </a-radio>
            </a-radio-group>
          </template>
          <template v-else-if="type === FORM_TYPE.SINGLE_SELECT">
            <a-select
              v-model="form[prop]"
              :placeholder="placeholder"
              allow-clear
            >
              <a-select-option v-for="({ id, name }, opsIdx) in options" :key="opsIdx" :value="id">
                {{ name }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="type === FORM_TYPE.MULTI_SELECT">
            <a-select
              v-model="form[prop]"
              :placeholder="placeholder"
              allow-clear
              mode="multiple"
            >
              <a-select-option v-for="({ id, name }, opsIdx) in options" :key="opsIdx" :value="id">
                {{ name }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else-if="type === FORM_TYPE.SHORT_TEXT">
            <a-input
              v-model="form[prop]"
              :placeholder="placeholder"
            />
          </template>
          <template v-else-if="type === FORM_TYPE.LONG_TEXT">
            <a-textarea
              v-model="form[prop]"
              :placeholder="placeholder"
            />
          </template>
          <template v-else-if="type === FORM_TYPE.EMAIL">
            <a-input
              v-model="form[prop]"
              type="email"
              :placeholder="placeholder"
            />
          </template>
          <template v-else-if="type === FORM_TYPE.NUMBER">
            <a-input
              v-model.number="form[prop]"
              type="number"
              :placeholder="placeholder"
            />
          </template>
        </a-form-model-item>
      </div>
    </template>

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
        {{ !isCreate ? 'Edit' : 'Tambahkan' }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import Vue from 'vue'
import { FORM_TYPE } from '@/constants'
import isEmpty from 'lodash/isEmpty'
import { mainForm } from '~/schemas/form'

export default Vue.extend({
  props: {
    isFormData: {
      type: Boolean,
      default: true
    },
    dataEdit: {
      type: Object,
      default: () => null
    },
    filterPost: {
      type: Object,
      default: () => {}
    },
    otherFields: {
      type: Array,
      default: () => []
    },
    service: {
      type: String,
      default: ''
    },
    feature: {
      type: String,
      default: ''
    },
    mainForm: {
      type: Array,
      default: () => mainForm
    }
  },
  data () {
    return {
      FORM_TYPE,
      loadingForm: false,
      newOtherFields: [],
      defaultForm: {},
      form: {},
      rules: {}
    }
  },
  computed: {
    isCreate () {
      return isEmpty(this.dataEdit)
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
  created () {
    this.generateMainForm()
    this.generateAdditionalForm()

    if (!this.isCreate) {
      this.setDataEdit(this.dataEdit)
    }
  },
  methods: {

    filterByField (fieldType) {
      const fields = []
      this.mainForm.forEach((main) => {
        const { form } = main
        form.forEach((field) => {
          const isMultiUploadType = field.type === fieldType
          if (isMultiUploadType) {
            fields.push(field.prop)
          }
        })
      })
      return fields
    },

    async deleteImages () {
      if (!this.isCreate) {
        const shouldDelete = []
        const fieldMultiUpload = this.filterByField(FORM_TYPE.MULTI_UPLOAD)
        fieldMultiUpload.forEach((prop) => {
          this.dataEdit[prop].forEach((edit) => {
            let isDelete = true
            const newForm = { ...this.form }
            newForm[prop].forEach((img) => {
              if (img.id) {
                const sameId = img.id === edit.id
                if (sameId) {
                  isDelete = false
                }
              }
            })
            if (isDelete) {
              shouldDelete.push(edit)
            }
          })
        })
        const reqAll = shouldDelete.map(del => this.$strapi.delete('upload/files', del.id))
        await Promise.all(reqAll)
      }
    },

    generateData () {
      const formData = new FormData()
      const newForm = { ...this.form }

      const fieldMultiUpload = this.filterByField(FORM_TYPE.MULTI_UPLOAD)
      fieldMultiUpload.forEach((field) => {
        const images = newForm[field] || []
        if (images.length > 0) {
          images.forEach(({ originFileObj, name }) => {
            if (originFileObj) {
              formData.append(`files.${field}`, originFileObj, name)
            }
          })
        }
        delete newForm[field]
      })
      if (this.isFormData) {
        formData.append('data', JSON.stringify({ ...newForm, ...this.filterPost }))
        return formData
      }
      return { ...newForm, ...this.filterPost }
    },
    setDataEdit (newVal) {
      const newForm = { ...newVal }
      const fieldSingleSelect = this.filterByField(FORM_TYPE.SINGLE_SELECT)
      const fieldMultiSelect = this.filterByField(FORM_TYPE.MULTI_SELECT)
      const mergeFields = fieldSingleSelect.concat(fieldMultiSelect)

      mergeFields.forEach((field) => {
        newForm[field] = newForm[field]?.id || 0
      })

      this.form = newForm
    },
    resetForm () {
      this.form = { ...this.defaultForm }
      this.generateAdditionalForm()
    },

    async create () {
      this.loadingForm = true
      try {
        const req = this.generateData()
        await this.$strapi[`$${this.service}`].create(req)
        this.$message.success(`Berhasil menambah ${this.feature}`)
        this.resetForm()
        this.$emit('onCreated')
      } catch (err) {
        this.$message.error(`Gagal menambah ${this.feature}, silahkan coba lagi`)
      } finally {
        this.loadingForm = false
      }
    },

    async edit () {
      this.loadingForm = true
      try {
        const req = this.generateData()
        const reqAll = [this.$strapi[`$${this.service}`].update(this.dataEdit?.id, req), this.deleteImages()]
        await Promise.all(reqAll)
        this.$message.success(`Berhasil edit ${this.feature}`)
        this.resetForm()
        this.$emit('onEdited')
      } catch (err) {
        this.$message.error(`Gagal edit ${this.feature}, silahkan coba lagi`)
      } finally {
        this.loadingForm = false
      }
    },

    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            this.create()
          } else {
            this.edit()
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

    generateMainForm () {
      const newRules = {}
      const newForm = {}

      this.mainForm.forEach((section) => {
        const { form = [] } = section
        form.forEach((each) => {
          const { isRequired, prop, rules = [] } = each
          newForm[prop] = undefined

          if (isRequired) {
            newRules[prop] = [
              ...rules,
              { required: true, message: 'Field is required', trigger: 'change' }
            ]
          }
        })
      })

      this.rules = { ...newRules }
      this.form = { ...newForm }
      this.defaultForm = { ...newForm }
    },

    generateAdditionalForm () {
      const newRules = { ...this.rules, otherDatas: {} }
      const newForm = { ...this.form, otherDatas: {} }
      const newOtherFields = [...this.otherFields]
      this.otherFields.forEach(({ label = '', isRequired = false }, idx) => {
        const newLabel = this.capitalize(label)
        newForm.otherDatas[newLabel] = undefined
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
