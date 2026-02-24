const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '포스트', href: '/posts' },
  { label: '소개', href: '/about' },
];

function HeaderView() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="header-logo">
          KHS.dev
        </a>
        <nav>
          <ul className="header-nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="header-nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="header-cta"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

export default HeaderView;
