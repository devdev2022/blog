const PAGE_LINKS = [
  { label: "홈", href: "/" },
  { label: "포스트", href: "/posts" },
  { label: "소개", href: "/about" },
];

const SOCIAL_LINKS = [{ label: "GitHub", href: "https://github.com" }];

function FooterView() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand-name">KHS.dev</p>
          <p className="footer-brand-desc">
            개발하면서 배우고 경험한 것들을
            <br />
            기록하는 개발자 블로그입니다.
          </p>
        </div>
        <div>
          <p className="footer-col-title">페이지</p>
          <ul className="footer-links">
            {PAGE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-col-title">소셜</p>
          <ul className="footer-links">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">© 2026 KHS.dev. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterView;
