import re
from textblob import TextBlob
from collections import Counter


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text


def _detect_text_column(df):
    """
    Automatically detect text column for sentiment analysis
    """
    for col in df.columns:
        if df[col].dtype == object:
            return col
    raise ValueError("No text column found in feedback dataset")


def sentiment_analysis(df):
    text_col = _detect_text_column(df)

    df["clean_text"] = df[text_col].apply(clean_text)
    df["sentiment_score"] = df["clean_text"].apply(
        lambda x: TextBlob(x).sentiment.polarity
    )

    sentiment_counts = {
        "Positive": int((df["sentiment_score"] > 0).sum()),
        "Neutral": int((df["sentiment_score"] == 0).sum()),
        "Negative": int((df["sentiment_score"] < 0).sum())
    }

    return sentiment_counts


def top_keywords(df, top_n=10):
    if "clean_text" not in df.columns:
        raise ValueError("Run sentiment analysis before extracting keywords")

    words = " ".join(df["clean_text"]).split()
    freq = Counter(words).most_common(top_n)

    return {
        "labels": [w for w, _ in freq],
        "values": [c for _, c in freq]
    }
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans


def topic_modeling(df, n_topics=3, top_n=10):
    """
    Simple topic modeling using TF-IDF + KMeans
    Returns top keywords per topic
    """
    if "clean_text" not in df.columns:
        # run sentiment once to prepare clean_text
        sentiment_analysis(df)

    vectorizer = TfidfVectorizer(stop_words="english", max_features=500)
    X = vectorizer.fit_transform(df["clean_text"])

    kmeans = KMeans(n_clusters=n_topics, random_state=42)
    labels = kmeans.fit_predict(X)

    terms = vectorizer.get_feature_names_out()
    centers = kmeans.cluster_centers_

    topics = {}
    for i in range(n_topics):
        top_indices = centers[i].argsort()[-top_n:][::-1]
        topics[f"Topic {i+1}"] = [terms[j] for j in top_indices]

    return topics
