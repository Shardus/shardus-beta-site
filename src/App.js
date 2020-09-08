import React from 'react';
import Navbar from './components/Navbar';

import styles from './App.module.css'
import Section from './components/section/Section';

const App = () => {
  return (
    <div className={styles}>
      <Navbar />
      <Section />
    </div>
  );
}

export default App;


