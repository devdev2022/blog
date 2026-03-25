const SOCIAL_LINKS = [{ label: "GitHub", href: "https://github.com" }];

interface FooterViewProps {
  showScrollTop: boolean;
  onScrollTop: () => void;
}

function FooterView({ showScrollTop, onScrollTop }: FooterViewProps) {
  return (
    <>
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

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={onScrollTop}
          aria-label="맨 위로 이동"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </>
  );
}

export default FooterView;
