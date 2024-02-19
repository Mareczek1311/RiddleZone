import React from 'react';
import styles from './Footer.module.css'; // Załóżmy, że masz osobny plik CSS dla styli footera

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>QUIZ!?.</p>
        <nav>
          <ul className={styles.footerLinks}>
            <li><a href="#">GITHUB</a></li>
            <li><a href="#">Kontakt</a></li>
          </ul>
        </nav>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} QUIZ!?. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}
