import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>BookWorm</h1>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#f0f8f5', // Soft light green
    padding: '10px 0',
    textAlign: 'center',
    width: '100%',
  },
  title: {
    color: '#6abd91', // Soft green text
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    fontSize: '24px',
  },
};

export default Header;
