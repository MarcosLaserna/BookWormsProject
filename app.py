from flask import Flask, request, jsonify
from flask_cors import CORS
from graph import recommend_books as recommend_books_graph
from hashmap import recommend_books as recommend_books_hashmap
import time

app = Flask(__name__)
CORS(app)


@app.route('/recommendations/graph', methods=['POST'])
def graph_recommendations():
    liked_books = request.json.get('liked_books', [])
    start_time = time.time() 
    recommendations = recommend_books_graph(liked_books)
    end_time = time.time()
    duration = end_time - start_time
    return jsonify({"recommendations": recommendations, "time_taken": duration})


@app.route('/recommendations/hashmap', methods=['POST'])
def hashmap_recommendations():
    liked_books = request.json.get('liked_books', [])
    start_time = time.perf_counter() 
    recommendations = recommend_books_hashmap(liked_books)
    end_time = time.perf_counter()
    duration = end_time - start_time 
    return jsonify({"recommendations": recommendations, "time_taken": duration})


if __name__ == '__main__':
    app.run(debug=True)
