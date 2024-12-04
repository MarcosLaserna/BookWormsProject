import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const PreferencesForm = () => {
  const [likedBooks, setLikedBooks] = useState(['']);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const updatedBooks = [...likedBooks];
    updatedBooks[index] = value;
    setLikedBooks(updatedBooks);
  };

  const handleAddBook = () => {
    if (likedBooks.length < 5) {
      setLikedBooks([...likedBooks, '']);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/recommendations', { state: { likedBooks } });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>BookWorms</h1>
      </header>
      <div style={styles.formContainer}>
        <h2 style={styles.formHeading}>Favorite Books</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {likedBooks.map((book, index) => (
            <div key={index} style={styles.inputGroup}>
              <input
                type="text"
                placeholder={`Book ${index + 1}`}
                value={book}
                onChange={(e) => handleChange(index, e.target.value)}
                required
                style={styles.input}
              />
            </div>
          ))}
          {likedBooks.length < 5 && (
            <button type="button" onClick={handleAddBook} style={styles.addButton}>
              Add Another Book
            </button>
          )}
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
  
};

const styles = {
  container: {
    backgroundColor: 'white',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    width: '100%',
    backgroundColor: '#e6f7e5',
    padding: '20px 0',
    textAlign: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    fontSize: '2rem',
    color: '#4caf50',
    margin: 0,
  },
  formContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '600px', // Ensures consistent alignment
    marginTop: '20px',
    textAlign: 'center',
  },
  formHeading: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center', // Aligns all children consistently
  },
  inputGroup: {
    width: '100%', // Ensures inputs stretch the same width
    display: 'flex',
    justifyContent: 'center',
  },
  input: {
    width: '90%', // Ensures the input is smaller than the container
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    color: 'black',
    borderRadius: '4px',
  },
  addButton: {
    width: '90%',
    padding: '10px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    width: '90%',
    padding: '10px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PreferencesForm;
