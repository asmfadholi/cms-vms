export default (context, inject) => {
  const getAuthWithArea = (req = {}) => {
    const currentRole = context.$cookies.get('role_id')
    if (currentRole === 'admin_area') {
      const areaId = context.$cookies.get('area_id') || 0
      return { 'area.id': areaId, ...req, _sort: 'id:DESC' }
    }
    return { ...req, _sort: 'id:DESC' }
  }

  const postAuthWithArea = (req = {}) => {
    const currentRole = context.$cookies.get('role_id')
    if (currentRole === 'admin_area') {
      const areaId = context.$cookies.get('area_id') || 0
      return { area: { id: areaId }, ...req }
    }
    return { ...req }
  }

  const getWahanaWithAuth = (req = {}) => {
    const currentRole = context.$cookies.get('role_id')
    if (currentRole === 'admin_area') {
      const areaId = context.$cookies.get('area_id') || 0
      return { 'area.id': areaId, ...req, _sort: 'id:DESC' }
    }
    return { ...req, _sort: 'id:DESC' }
  }

  const postWahanaWithAuth = (req = {}) => {
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

  inject('getAuthWithArea', getAuthWithArea)
  inject('postAuthWithArea', postAuthWithArea)

  inject('getWahanaWithAuth', getWahanaWithAuth)
  inject('postWahanaWithAuth', postWahanaWithAuth)

  inject('isAdminArea', isAdminArea)
  inject('isAdminWahana', isAdminWahana)
  inject('isSuperAdmin', isSuperAdmin)

  context.$getAuthWithArea = getAuthWithArea
  context.$postAuthWithArea = postAuthWithArea

  context.$getWahanaWithAuth = getWahanaWithAuth
  context.$postWahanaWithAuth = postWahanaWithAuth

  context.$isAdminArea = isAdminArea
  context.$isAdminWahana = isAdminWahana
  context.$isSuperAdmin = isSuperAdmin
}
