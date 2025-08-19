// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';
import styles from './hamburgerMenu.module.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
      </div>
      <nav className={isOpen ? styles.menuOpen : styles.menu}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/escape-room">Escape Room</a></li>
          <li><a href="/coding-races">Coding Races</a></li>
          <li><a href="/court-room">Court Room</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;