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
import moment from 'moment'
// import { form, customColumns } from '~/schemas/area'

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
    title: 'About Ticket',
    form: [
      {
        isRequired: true,
        label: 'Pilih Jenis Tiket',
        type: 'singleSelect',
        prop: 'package',
        options: [],
        placeholder: 'Ex: Tiket masuk'
      },
      {
        isRequired: true,
        label: 'Pilih Tanggal',
        type: 'date',
        prop: 'ticketDate',
        disabledDate: current => current && current < moment().startOf('day'),
        placeholder: 'Tulis Tanggal'
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
      feature: 'Ticket',
      refTable: 'tableTicket',
      needFormService: true,
      limit: 10,
      service: 'tickets'
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
      return { area: { id: this.areaId } }
    }
  },
  created () {
    this.getPackages()
  },
  methods: {
    async getPackages () {
      const res = await this.$strapi.$packages.find(this.filterGet)
      form[0].form[0].options = res
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
