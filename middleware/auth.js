export default function ({ redirect, route, $cookies }) {
  if ($cookies.get('user_id') && !route.path.includes('dashboard')) {
    return redirect('/dashboard')
  }
}
