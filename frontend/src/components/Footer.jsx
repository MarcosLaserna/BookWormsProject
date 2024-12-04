import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      Project By: Marcos Laserna, Yuvika Shendge, and Aiden Everage
    </footer>
  );
};

const styles = {
  footer: {
    position: 'fixed', // Ensures it's anchored to the bottom of the viewport
    bottom: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#888',
    backgroundColor: 'white', // Matches the background of the app
    zIndex: 10, // Ensures it stays above other elements
    padding: '10px 0',
    boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow for separation
  },
};

export default Footer;
