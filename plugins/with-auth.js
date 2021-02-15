export default (context, inject) => {
  const getWithAuth = (req = {}) => {
    const currentRole = context.$cookies.get('role_id')
    if (currentRole === 'admin_area') {
      const areaId = context.$cookies.get('area_id') || 0
      return { id: areaId, ...req, _sort: 'id:DESC' }
    }
    return { ...req, _sort: 'id:DESC' }
  }

  const postWithAuth = (req = {}) => {
    const currentRole = context.$cookies.get('role_id')
    if (currentRole === 'admin_area') {
      const areaId = context.$cookies.get('area_id') || 0
      return { area: { id: areaId }, ...req }
    }
    return { ...req }
  }

  const isAdminArea = () => {
    const roleId = context.$cookies.get('role_id') || 0
    return roleId === 'admin_area'
  }

  const isAdminWahana = () => {
    const roleId = context.$cookies.get('role_id') || 0
    return roleId === 'admin_wahana'
  }

  const isSuperAdmin = () => {
    const roleId = context.$cookies.get('role_id') || 0
    return roleId === 'authenticated'
  }

  inject('getWithAuth', getWithAuth)
  inject('postWithAuth', postWithAuth)
  inject('isAdminArea', isAdminArea)
  inject('isAdminWahana', isAdminWahana)
  inject('isSuperAdmin', isSuperAdmin)

  context.$getWithAuth = getWithAuth
  context.$postWithAuth = postWithAuth
  context.$isAdminArea = isAdminArea
  context.$isAdminWahana = isAdminWahana
  context.$isSuperAdmin = isSuperAdmin
}
