import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

const Recommendations = () => {
  const { state } = useLocation();
  const { likedBooks } = state || { likedBooks: [] };

  const [graphRecommendations, setGraphRecommendations] = useState([]);
  const [hashmapRecommendations, setHashmapRecommendations] = useState([]);
  const [graphTime, setGraphTime] = useState(0);
  const [hashmapTime, setHashmapTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch Graph Recommendations
        const graphResponse = await fetch('http://localhost:5000/recommendations/graph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ liked_books: likedBooks }),
        });
        const graphData = await graphResponse.json();
        setGraphRecommendations(graphData.recommendations || []);
        setGraphTime(graphData.time_taken); // Set time taken for graph recommendations

        // Fetch Hashmap Recommendations
        const hashmapResponse = await fetch('http://localhost:5000/recommendations/hashmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ liked_books: likedBooks }),
        });
        const hashmapData = await hashmapResponse.json();
        setHashmapRecommendations(hashmapData.recommendations || []);
        setHashmapTime(hashmapData.time_taken); // Set time taken for hashmap recommendations
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [likedBooks]);

  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map((word) => {
        if (word.startsWith('(')) {
          // Capitalize the first letter after an opening parenthesis
          return '(' + word.charAt(1).toUpperCase() + word.slice(2);
        }
        return word
          .split("'")
          .map((subword, index) =>
            index === 0 ? subword.charAt(0).toUpperCase() + subword.slice(1) : subword
          )
          .join("'");
      })
      .join(' ');
  };
  

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>BookWorms</h1>
      </header>
      <div style={styles.recommendationsWrapper}>
        {/* Graph Recommendations */}
        <div style={styles.recommendationsContainer}>
          <h2 style={styles.recommendationsHeading}>Graph Recommendations</h2>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : (
            <>
              <p style={styles.timer}>Time Taken: {graphTime.toFixed(4)} seconds</p>
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
            </>
          )}
        </div>

        {/* Hashmap Recommendations */}
        <div style={styles.recommendationsContainer}>
          <h2 style={styles.recommendationsHeading}>Hashmap Recommendations</h2>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : (
            <>
              <p style={styles.timer}>Time Taken: {hashmapTime.toFixed(4)} seconds</p>
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
            </>
          )}
        </div>
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
  recommendationsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '20px',
    gap: '20px',
    padding: '0 20px',
  },
  recommendationsContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    width: '40%',
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
  timer: {
    color: 'black'
  },
};

export default Recommendations;
