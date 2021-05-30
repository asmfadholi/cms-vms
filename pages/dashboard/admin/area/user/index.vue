<template>
  <LazyCrudModule
    :custom-columns="customColumns"
    :feature="feature"
    :ref-table="refTable"
    :need-form-service="needFormService"
    :limit="limit"
    :service="service"
    search-by="username"
    :filter-get="filterGet"
    :is-form-data="false"
    :filter-post="filterPost"
    :form="form"
  />
</template>

<script>
import Vue from 'vue'
// import { form } from '~/schemas/area'

const customColumns = [
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
    key: 'role'
  },
  {
    title: 'Wahana',
    dataIndex: 'wahana.name',
    key: 'wahana'
  }
]

const form = [
  {
    title: 'About Staff',
    form: [
      {
        isRequired: true,
        label: 'Username',
        prop: 'username',
        type: 'shortText',
        placeholder: 'Ex: admin area 1'
      },
      {
        isRequired: true,
        label: 'Email',
        prop: 'email',
        type: 'shortText',
        placeholder: 'Ex: email.admin@gmail.com'
      },
      {
        isRequired: true,
        label: 'Password',
        prop: 'password',
        type: 'shortText',
        placeholder: 'Ex: *****'
      },
      {
        isRequired: true,
        label: 'Role',
        prop: 'role',
        type: 'singleSelect',
        options: [{ name: 'Admin Wahana', id: 5 }],
        placeholder: 'Pilih Role'
      },
      {
        isRequired: true,
        label: 'Pilih Wahana',
        prop: 'wahana',
        type: 'singleSelect',
        options: [],
        placeholder: 'Pilih Wahana'
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
      feature: 'Staff',
      refTable: 'tableUser',
      needFormService: false,
      limit: 10,
      service: 'users'
    }
  },
  computed: {
    areaId () {
      return this.$cookies.get('area_id')
    },
    filterGet () {
      return { 'area.id': this.areaId, '_where[0][role.type_ne]': 'admin_area', '_where[1][role.type_ne]': 'super_admin', '_where[2][role.type_ne]': 'authenticated' }
    },
    filterPost () {
      return { area: { id: this.areaId } }
    }
  },
  created () {
    this.getWahanas()
  },
  methods: {
    async getWahanas () {
      const res = await this.$strapi.$wahanas.find({ 'area.id': this.areaId })
      form[0].form[4].options = res
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
