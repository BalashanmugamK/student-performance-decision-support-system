import re
import pandas as pd
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text

def sentiment_analysis(df):
    if df is None:
        raise ValueError("Feedback dataset not uploaded")

    if "feedback" not in df.columns:
        raise ValueError("Column 'feedback' not found in dataset")

    df["clean_feedback"] = df["feedback"].apply(clean_text)
    df["sentiment_score"] = df["clean_feedback"].apply(
        lambda x: TextBlob(x).sentiment.polarity
    )

    return df["sentiment_score"].describe().to_dict()

def topic_modeling(df):
    vectorizer = TfidfVectorizer(stop_words="english", max_features=500)
    X = vectorizer.fit_transform(df["clean_feedback"])

    kmeans = KMeans(n_clusters=3, random_state=42)
    labels = kmeans.fit_predict(X)

    return {
        "top_terms": vectorizer.get_feature_names_out()[:10].tolist()
    }
