import Link from 'next/link'

export const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'sign up', href: '/auth/signup' },
    !currentUser && { label: 'sign in', href: '/auth/signin' },
    currentUser && { label: 'sign out', href: '/auth/signout' }
  ]
    .filter(link => link)
    .map(({ label, href }) => (
      <li key={label}>
        <Link href={href}>
          <a className='nav-link'>{label}</a>
        </Link>
      </li>
    ))
  return (
    <nav className='navbar navbar-light bg-light container'>
      <Link href='/'>
        <a className='navbar-brand'>Home</a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  )
}

export default Header
