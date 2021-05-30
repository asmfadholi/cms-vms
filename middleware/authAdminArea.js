export default function ({ redirect, route, $cookies }) {
  const isAdminArea = $cookies.get('role_id') === 'admin_area'
  if ($cookies.get('user_id') && !route.path.includes('dashboard')) {
    return redirect('/dashboard/admin/area/area')
  } else if (!isAdminArea) {
    return redirect('/error')
  }
}
