import ROLES from '~/schemas/rolex'

export default (context, inject) => {
  const accessElement = (service) => {
    const roleId = context.$cookies.get('role_id') || 0
    return ROLES[roleId][service]
  }

  inject('accessElement', accessElement)

  context.$accessElement = accessElement
}
