import re
from textblob import TextBlob
from collections import Counter

def clean_text(text):
    text = str(text).lower()
    return re.sub(r"[^a-z\s]", "", text)

def sentiment_analysis(df):
    df["clean"] = df["feedback"].apply(clean_text)
    df["sentiment"] = df["clean"].apply(lambda x: TextBlob(x).sentiment.polarity)

    return {
        "labels": ["Positive","Neutral","Negative"],
        "values": [
            int((df["sentiment"] > 0).sum()),
            int((df["sentiment"] == 0).sum()),
            int((df["sentiment"] < 0).sum())
        ]
    }

def topic_modeling(df):
    words = " ".join(df["feedback"].astype(str)).lower().split()
    freq = Counter(words).most_common(10)

    return {
        "labels": [w for w,_ in freq],
        "values": [c for _,c in freq]
    }
