export default function ({ redirect, route, $cookies }) {
  if ($cookies.get('user_id') && !route.path.includes('dashboard')) {
    const isAdminWahana = $cookies.get('role_id') === 'admin_wahana'
    const isAdminArea = $cookies.get('role_id') === 'admin_area'
    if (isAdminWahana) {
      return redirect('/dashboard/admin/wahana')
    } else if (isAdminArea) {
      return redirect('/dashboard/admin/area')
    }
  }
}
