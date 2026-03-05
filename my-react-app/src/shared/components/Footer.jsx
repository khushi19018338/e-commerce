function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Built with React & Node.js
        </p>
      </div>
    </footer>
  );
}

export default Footer;

