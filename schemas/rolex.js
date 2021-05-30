export const SUPER_ADMIN = 'super_admin'
export const ADMIN_AREA = 'admin_area'
export const ADMIN_WAHANA = 'admin_wahana'

export default {
  [SUPER_ADMIN]: {
    areas: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    forms: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    packages: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    tickets: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    users: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    visitors: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    'wahana-visitors': {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    wahanas: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    }
  },
  [ADMIN_AREA]: {
    areas: {
      list: true,
      create: false,
      delete: false,
      edit: true,
      search: false,
      filter: ''
    },
    users: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    forms: {
      list: true,
      create: false,
      delete: false,
      edit: true,
      search: false,
      filter: ''
    },
    visitors: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    tickets: {
      list: true,
      create: true,
      delete: true,
      edit: false,
      search: true,
      filter: ''
    },
    wahanas: {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    },
    'wahana-visitors': {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    }
  },
  [ADMIN_WAHANA]: {
    areas: {
      list: true,
      create: false,
      edit: false,
      delete: false,
      search: false,
      filter: ''
    },
    visitors: {
      list: true,
      create: false,
      delete: false,
      edit: false,
      search: true,
      filter: ''
    },
    tickets: {
      list: true,
      create: false,
      delete: false,
      edit: false,
      search: true,
      filter: ''
    },
    'wahana-visitors': {
      list: true,
      create: true,
      delete: true,
      edit: true,
      search: true,
      filter: ''
    }
  }
}
