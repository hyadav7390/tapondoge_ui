export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="social-links">
            <a href="https://discord.gg/CHbTua4UZj" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-discord"></i>
            </a>
            <a href="https://x.com/tapondogehq" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <p className="copyright">© {new Date().getFullYear()} Tap on Doge. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          padding: 2rem 0;
          background-color: rgba(255, 255, 255, 0.05);
          border-top: 1px solid var(--color-border);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          color: var(--color-text);
          font-size: 1.5rem;
          transition: color 0.2s ease;
        }

        .social-link:hover {
          color: var(--color-primary);
        }

        .copyright {
          margin: 0;
          color: var(--color-text);
          opacity: 0.7;
          font-size: 0.875rem;
        }
      `}</style>
    </footer>
  );
}