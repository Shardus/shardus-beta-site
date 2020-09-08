import React from 'react';

import styles from './navbar.module.css'

const Navbar = () => {
  return(
    <nav className={styles.navbar}>
      <ul>
        <li>HOME</li>
        <li>EVENT</li>
        <li>TECHNOLOGY</li>
        <li>FEATURES</li>
        <li>TOKEN</li>
        <li>BOUNTIES</li>
        <li>ROADMAP</li>
        <li>TEAM</li>
        <li>FAQ</li>
        <li>JOIN</li>
        <li>RESOURCES</li>

      </ul>
    </nav>
  );
};

export default Navbar;

