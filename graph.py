import pandas as pd
import networkx as nx

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

# Add user nodes and the respective edges which represent users ratings
for _, row in user_books.iterrows():
    user_node = f"user_{row['ID']}"
    book_node = row['Id']
    G.add_node(user_node, type='user')
    G.add_edge(user_node, book_node, weight=row['user_rating'])


def recommend_books(liked_books):
    print(f"Liked Books Received: {liked_books}")  # Debugging line
    liked_books = [book.strip().lower() for book in liked_books]

    # Normalize dataset
    books['Name'] = books['Name'].str.strip().str.lower()

    # Match books
    liked_books_df = books[books['Name'].isin(liked_books)]
    print(f"Matched Books in Dataset:\n{liked_books_df}")  # Debugging line

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

    def find_users(liked_books_df):
        user_scores = {}
        print(f"Liked Books DataFrame for Users:\n{liked_books_df}")  # Debugging line

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

                if score > 0:
                    user_scores[user_node] = score

        ranked_users = sorted(user_scores.items(), key=lambda x: x[1], reverse=True)
        print(f"Ranked Users: {ranked_users}")  # Debugging line
        return ranked_users

    user_id = 0
    ranked_users = find_users(liked_books_df)

    recommended_books = []
    input_books = liked_books_df['Name'].str.lower().unique()  # Get input books to exclude them from recommendations

    if ranked_users:
        for user_node, _ in ranked_users[:5]:
            for book_node in G.neighbors(user_node):
                if G.nodes[book_node].get('type') == 'book':  # Ensure the node is a book
                    book_data = G.nodes[book_node]
                    print(f"Book Node Data: {book_data}")  # Debugging line
                    if book_data.get('name', '').lower() not in input_books:
                        bonus = calculate_bonus(book_data, liked_books_df)
                        recommended_books.append((book_data['name'], bonus))
                else:
                    print(f"Skipping non-book node: {G.nodes[book_node]}")  # Debugging line


    # Sort books by score
    recommended_books = sorted(recommended_books, key=lambda x: x[1], reverse=True)[:5]
    recommended_book_names = [book[0] for book in recommended_books]
    print(f"Recommended Books: {recommended_book_names}")  # Debugging line
    return recommended_book_names

