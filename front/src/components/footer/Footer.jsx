import "./Footer.css"; // ייבוא קובץ ה-CSS

function Footer() {
  return (
    <footer>
      <ul className="social_icon">
        <li>
          <a href="#">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="logo-linkedin"></ion-icon>
          </a>
        </li>
        <li>
          <a href="#">
            <ion-icon name="logo-instagram"></ion-icon>
          </a>
        </li>
      </ul>
      <ul className="menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Team</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <p>
        Welcome to POPify the ultimate POP dolls collection. Our feaured collection contains Disney Marvel etc.
      </p>
      <p>© 2024 POPify, Inc. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
