import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Recommendations = () => {
  const { state } = useLocation();
  const { likedBooks } = state || { likedBooks: [] };

  const [graphRecommendations, setGraphRecommendations] = useState([]);
  const [hashmapRecommendations, setHashmapRecommendations] = useState([]); // Empty for now
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const graphResponse = await fetch('http://localhost:5000/recommendations/graph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ liked_books: likedBooks }),
        });
        const graphData = await graphResponse.json();
        setGraphRecommendations(graphData.recommendations || []);

        // Placeholder for hashmap recommendations (to be implemented later)
        setHashmapRecommendations([]);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [likedBooks]);

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>BookWorm</h1>
      </header>
      <div style={styles.recommendationsWrapper}>
        {/* Graph Recommendations */}
        <div style={styles.recommendationsContainer}>
          <h2 style={styles.recommendationsHeading}>Graph Recommendations</h2>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : (
            <ul style={styles.list}>
              {graphRecommendations.length > 0 ? (
                graphRecommendations.map((rec, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.number}>{index + 1}.</span>
                    <span style={styles.bookTitle}>{capitalizeWords(rec)}</span>
                  </li>
                ))
              ) : (
                <p>No recommendations found.</p>
              )}
            </ul>
          )}
        </div>

        {/* Hashmap Recommendations */}
        <div style={styles.recommendationsContainer}>
          <h2 style={styles.recommendationsHeading}>Hashmap Recommendations</h2>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : (
            <ul style={styles.list}>
              {hashmapRecommendations.length > 0 ? (
                hashmapRecommendations.map((rec, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.number}>{index + 1}.</span>
                    <span style={styles.bookTitle}>{capitalizeWords(rec)}</span>
                  </li>
                ))
              ) : (
                <p>No recommendations found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
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
  recommendationsWrapper: {
    display: 'flex',
    flexDirection: 'row', // Align the two recommendation containers side by side
    justifyContent: 'space-around', // Space between the two containers
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '20px',
    gap: '20px', // Space between the two containers
    padding: '0 20px',
  },
  recommendationsContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    width: '40%', // Each container takes up 40% of the width
    textAlign: 'center',
  },
  recommendationsHeading: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    color: '#333',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    width: '100%',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '10px 15px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  number: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
  },
  bookTitle: {
    fontSize: '1.1rem',
    color: '#555',
    textAlign: 'left',
    flex: 1,
  },
};

export default Recommendations;
