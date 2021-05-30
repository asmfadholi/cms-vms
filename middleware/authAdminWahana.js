export default function ({ redirect, route, $cookies }) {
  const isAdminWahana = $cookies.get('role_id') === 'admin_wahana'
  if ($cookies.get('user_id') && !route.path.includes('dashboard')) {
    return redirect('/dashboard/admin/area/wahana')
  } else if (!isAdminWahana) {
    // return redirect('/error')
  }
}
