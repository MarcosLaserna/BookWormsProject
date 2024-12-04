import pandas as pd

# Map with the ratings
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

# Create hash maps for books and user preferences
book_info_hash_map = {
    row['Id']: {
        'name': row['Name'],
        'authors': row['Authors'],
        'rating': row['Rating'],
        'pages': row['pagesNumber']
    }
    for _, row in books.iterrows()
}

user_preferences_hash_map = {}
for _, row in user_books.iterrows():
    user_id = f"user_{row['ID']}"
    book_id = row['Id']
    if user_id not in user_preferences_hash_map:
        user_preferences_hash_map[user_id] = {'ratings': {}}
    user_preferences_hash_map[user_id]['ratings'][book_id] = row[['user_rating']]

# Clean data function
def clean_user_preferences(user_preferences_hash_map):
    cleaned_user_preferences = {}
    for user_id, prefs in user_preferences_hash_map.items():
        cleaned_ratings = {}
        for book_id, rating_series in prefs['ratings'].items():
            if pd.notna(book_id):  # Ignore NaN book IDs
                if isinstance(rating_series, pd.Series):
                    rating = rating_series.get('user_rating', None)
                    if pd.notna(rating):
                        cleaned_ratings[book_id] = rating
        cleaned_user_preferences[user_id] = {'ratings': cleaned_ratings}
    return cleaned_user_preferences

# Clean the user preferences hash map
user_preferences_hash_map = clean_user_preferences(user_preferences_hash_map)

# Recommendation function
def recommend_books(liked_books):
    liked_books = [book.strip().lower() for book in liked_books]
    liked_books_info = [
        info for info in book_info_hash_map.values() if info['name'] in liked_books
    ]

    # Find users who liked similar books
    def find_users(liked_books_info):
        user_scores = {}
        for user_id, prefs in user_preferences_hash_map.items():
            score = 0
            for book_info in liked_books_info:
                book_id = next((key for key, info in book_info_hash_map.items() if info['name'] == book_info['name']), None)
                if book_id and book_id in prefs['ratings'] and prefs['ratings'][book_id] >= 3:
                    score += 1
            if score > 0:
                user_scores[user_id] = score
        return sorted(user_scores.items(), key=lambda x: x[1], reverse=True)

    ranked_users = find_users(liked_books_info)

    # Generate recommendations
    recommended_books = []
    input_books = {info['name'] for info in liked_books_info}
    for user_id, _ in ranked_users[:5]:
        for book_id, rating in user_preferences_hash_map[user_id]['ratings'].items():
            book_info = book_info_hash_map.get(book_id)
            if book_info and book_info['name'] not in input_books and rating >= 4:
                recommended_books.append(book_info['name'])
    return list(set(recommended_books))[:5]
