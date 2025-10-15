// components/HamburgerMenu.tsx
'use client'
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './hamburgerMenu.module.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  // Close on Escape, and click outside
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current || !buttonRef.current) return;
      if (!menuRef.current.contains(e.target as Node) && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.hamburger}
        aria-haspopup="true"
        aria-controls="site-menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={toggleMenu}
      >
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
      </button>
      <nav
        id="site-menu"
        ref={menuRef}
        className={isOpen ? styles.menuOpen : styles.menu}
        role="menu"
        aria-label="Main menu"
      >
        <ul>
          <li role="none"><Link role="menuitem" href="/">Home</Link></li>
          <li role="none"><Link role="menuitem" href="/about">About</Link></li>
          <li role="none"><Link role="menuitem" href="/escape-room">Escape Room</Link></li>
          <li role="none"><Link role="menuitem" href="/coding-races">Coding Races</Link></li>
          <li role="none"><Link role="menuitem" href="/court-room">Court Room</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;