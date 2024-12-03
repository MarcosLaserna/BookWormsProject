import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

const Recommendations = () => {
  const { state } = useLocation();

  const recommendations = [
    { title: 'A Court of Thrones and Roses', description: 'Fantasy romance.', rating: '5/5' },
    { title: 'It Ends With Us', description: 'Contemporary drama.', rating: '4.5/5' },
    { title: 'Divergent', description: 'Dystopian adventure.', rating: '4/5' },
  ];

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <h1 style={styles.heading}>Personalized Book Recommendations</h1>
        <ul style={styles.list}>
          {recommendations.map((book, index) => (
            <li key={index} style={styles.card}>
              <h2 style={styles.title}>{book.title}</h2>
              <p style={styles.text}>{book.description}</p>
              <p style={styles.text}>Rating: {book.rating}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  heading: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    width: '80%',
  },
  card: {
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'black', // Black font for titles
  },
  text: {
    color: 'black', // Black font for descriptions and ratings
    fontSize: '1rem',
  },
};

export default Recommendations;
