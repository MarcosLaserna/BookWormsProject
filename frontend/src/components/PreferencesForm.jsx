import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const PreferencesForm = () => {
  const [form, setForm] = useState({
    name: '',
    likedBooks: '',
    genres: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/recommendations', { state: form });
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.formWrapper}>
        <h1 style={styles.heading}>Book Preferences</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Entry1" // Placeholder text for the Name field
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Liked Books:</label>
            <input
              type="text"
              name="likedBooks"
              value={form.likedBooks}
              onChange={handleChange}
              required
              placeholder="Entry2" // Placeholder text for the Liked Books field
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label>Genres:</label>
            <input
              type="text"
              name="genres"
              value={form.genres}
              onChange={handleChange}
              required
              placeholder="Entry3" // Placeholder text for the Genres field
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
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
  formWrapper: {
    backgroundColor: '#f7f7f7', // Light gray background
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '40%', // Slightly smaller width
    margin: 'auto', // Center the container
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white', // White background
    color: 'black', // Black text
    fontSize: '16px', // Ensure font size is readable
  },
  button: {
    padding: '12px',
    backgroundColor: '#6abd91',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  },
};

export default PreferencesForm;
