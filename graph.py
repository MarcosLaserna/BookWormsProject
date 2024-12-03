import pandas as pd
import networkx as nx
import random

ratemap = {
    "it was amazing": 5,
    "really liked it": 4,
    "liked it": 3,
    "it was ok": 2,
    "did not like it": 1
}

# Load books and user ratings datasets (10000 samples)
books = pd.read_csv('datasets/book/book1-100k.csv').head(10000)
user_books = pd.read_csv('datasets/rating/user_rating_0_to_1000.csv').head(10000)

# Choose the columns used for the algorithm
books = books[['Id', 'Name', 'Authors', 'Rating', 'pagesNumber']]
user_books = user_books[['ID', 'Name', 'Rating']]
user_books = user_books.rename(columns={'Rating': 'user_rating'})

# Normalize names
books['Name'] = books['Name'].str.strip().str.lower()
user_books['Name'] = user_books['Name'].str.strip().str.lower()

# Convert user rates to numbers
user_books['user_rating'] = user_books['user_rating'].map(ratemap)

# Merge user_books and books
user_books = user_books.merge(books, on='Name', how='left')

# Create graph
G = nx.Graph()

# Add book nodes
for _, row in books.iterrows():
    G.add_node(row['Id'], type='book', name=row['Name'], authors=row['Authors'], rating=row['Rating'],
               pages=row['pagesNumber'])

# Add user nodes and the respective edges which represents users ratings
for _, row in user_books.iterrows():
    user_node = f"user_{row['ID']}"
    book_node = row['Id']
    G.add_node(user_node, type='user')
    G.add_edge(user_node, book_node, weight=row['user_rating'])


# Function to obtain liked books in the input
def get_liked_books():
    liked_books = []
    print("Enter the names of the books you like (type 'done' when finished):")
    while True:
        book_name = input("Book name: ").strip().lower()
        if book_name == 'done':
            break
        liked_books.append(book_name)
    return liked_books


# Get liked books
liked_books = get_liked_books()

# Filter similar books that match liked books
liked_books_df = books[books['Name'].isin(liked_books)]

# Function to calculate bonus points
def calculate_bonus(book_data, liked_books_df):
    bonus = 0
    liked_authors = liked_books_df['Authors'].str.lower().unique()

    # Extra points if author sharing
    authors = book_data.get('authors', '').lower().split(",")
    for author in authors:
        if author.strip() in liked_authors:
            bonus += 1

    # Half point if near 150 pages of the average
    average = liked_books_df['pagesNumber'].mean()
    book_pages = book_data.get('pages', 0)  # Safely access 'pages' key, default to 0 if missing
    page_diff = abs(book_pages - average)
    if page_diff <= 150:  # Allow a small range of similarity in page numbers
        bonus += 0.5

    return bonus

# Function to find similar user
def find_users(liked_books_df):
    user_scores = {}

    for user_node in G.nodes:
        if G.nodes[user_node].get('type') == 'user':
            score = 0
            for _, row in liked_books_df.iterrows():
                book_name = row['Name']
                book_node = books[books['Name'] == book_name]['Id'].iloc[0]

                if G.has_edge(user_node, book_node):
                    user_rating = G[user_node][book_node]['weight']
                    if user_rating >= 3:
                        score += 1

            # Only consider users who liked at least one book
            if score > 0:
                user_scores[user_node] = score

    ranked_users = sorted(user_scores.items(), key=lambda x: x[1], reverse=True)
    return ranked_users


import random


def recommend_books_for_user(user_id, ranked_users, liked_books_df, G, books):
    recommended_books = []
    input_books = liked_books_df['Name'].str.lower().unique()  # Get input books to exclude them from recommendations

    if ranked_users:
        for user_node, _ in ranked_users[:5]:
            highest_rating = 0
            books_with_highest_rating = []

            for book_node in G.neighbors(user_node):
                if G.has_edge(user_node, book_node):
                    user_rating = G[user_node][book_node]['weight']
                    if user_rating > highest_rating:
                        highest_rating = user_rating
                        books_with_highest_rating = [book_node]
                    elif user_rating == highest_rating:
                        books_with_highest_rating.append(book_node)

            # Calculate bonuses
            for book_node in books_with_highest_rating:
                book_data = G.nodes[book_node]

                # Make sure the book_data contains the 'name' key
                if 'name' in book_data:
                    bonus = calculate_bonus(book_data, liked_books_df)
                    final_score = highest_rating + bonus

                    # Only add book if it is not in the liked books (input books)
                    if book_data['name'].lower() not in input_books:
                        recommended_books.append((book_node, final_score))
                else:
                    print(f"Error: 'name' attribute missing for book node {book_node}")

    else:
        # If no similar users found, recommend the highest rated books
        highest_rated_books = sorted(books.itertuples(), key=lambda x: x.Rating, reverse=True)
        highest_rated_books = [book for book in highest_rated_books if book.Rating < 5]
        random.shuffle(highest_rated_books)
        highest_rated_books = highest_rated_books[:5]

        for book in highest_rated_books:
            book_data = G.nodes[book.Id]

            bonus = calculate_bonus(book_data, liked_books_df)
            final_score = book.Rating + bonus

            if book_data['name'].lower() not in input_books:
                recommended_books.append((book.Id, final_score))


    # Sort books by final score
    recommended_books = sorted(recommended_books, key=lambda x: x[1], reverse=True)[:5]

    # Get the top 5 books
    recommended_book_names = [G.nodes[book[0]]['name'] for book in recommended_books]

    return recommended_book_names


# Function to display recommended books
def display_recommendations(user_id, recommended_books):
    print(f"\nRecommended Books for User {user_id}:\n")
    for idx, book in enumerate(recommended_books, 1):
        print(f"{idx}. {book}")
        print("=" * 50)

user_id = 0
ranked_users = find_users(liked_books_df)
recommended_books = recommend_books_for_user(user_id, ranked_users, liked_books_df, G, books)
display_recommendations(user_id, recommended_books)
