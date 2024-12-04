from flask import Flask, request, jsonify
from flask_cors import CORS
from graph import recommend_books
import nbformat
from nbconvert import PythonExporter

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load and execute the notebook dynamically
def execute_notebook(notebook_path):
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = nbformat.read(f, as_version=4)
    exporter = PythonExporter()
    code, _ = exporter.from_notebook_node(notebook)
    exec_globals = {}
    exec(code, exec_globals)
    return exec_globals

# Load the HashMap notebook
hashmap_globals = execute_notebook('HashMaps.ipynb')

@app.route('/recommendations/graph', methods=['POST'])
def graph_recommendations():
    liked_books = request.json.get('liked_books', [])
    recommendations = recommend_books(liked_books)
    return jsonify({"recommendations": recommendations})

@app.route('/recommendations/hashmap', methods=['POST'])
def hashmap_recommendations():
    # Call the display_recommended_books function from the notebook
    user_id = request.json.get('user_id', 101)  # Default to user 101 for now
    display_recommended_books = hashmap_globals['display_recommended_books']
    book_info_hash_map = hashmap_globals['book_info_hash_map']
    user_preferences_hash_map = hashmap_globals['user_preferences_hash_map']

    # Get recommendations for the user
    recommendations = display_recommended_books(user_id, book_info_hash_map, user_preferences_hash_map)
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True)
