<template>
  <LazyCrudModule
    :custom-columns="customColumns"
    :feature="feature"
    :ref-table="refTable"
    :need-form-service="needFormService"
    :limit="limit"
    :service="service"
    :filter-get="filterGet"
    :filter-post="filterPost"
    :form="form"
  />
</template>

<script>
import Vue from 'vue'

const customColumns = [
  {
    dataIndex: 'bookingCode',
    key: 'bookingCode',
    title: 'Booking Code',
    fixed: 'left'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '130px',
    fixed: 'left'
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber'
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender'
  }
]

const form = [
  {
    title: 'About Visitor',
    form: [
      {
        isRequired: true,
        label: 'Booking Code',
        prop: 'bookingCode',
        type: 'shortText',
        placeholder: 'Masukkan Booking Code'
      },
      {
        isRequired: true,
        label: 'Name',
        prop: 'name',
        type: 'shortText',
        placeholder: 'Ex: nama saya'
      },
      {
        isRequired: true,
        label: 'Email',
        prop: 'email',
        type: 'email',
        placeholder: 'Ex: Email saya'
      },
      {
        isRequired: true,
        label: 'phone Number',
        prop: 'phoneNumber',
        type: 'shortText',
        placeholder: 'Ex: 086333333333'
      },
      {
        isRequired: true,
        label: 'Gender',
        prop: 'gender',
        type: 'radio',
        options: [{ name: 'Perempuan', id: 'perempuan' }, { name: 'Laki-laki', id: 'laki-laki' }],
        placeholder: 'Ex: 100'
      }
    ]
  }
]

export default Vue.extend({
  layout: 'layoutAdminArea',
  middleware: 'authAdminArea',
  scrollToTop: true,
  transition: 'slide-bottom',
  data () {
    return {
      customColumns,
      form,
      feature: 'Visitor Area',
      refTable: 'tableVisitor',
      needFormService: true,
      limit: 10,
      service: 'visitors'
    }
  },
  computed: {
    areaId () {
      return this.$cookies.get('area_id')
    },
    filterGet () {
      return { 'area.id': this.areaId }
    },
    filterPost () {
      return { area: { id: this.areaId }, isCheckin: true }
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
