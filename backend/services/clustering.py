import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

FEATURES = ["studytime", "absences", "G1", "G2", "failures"]

def cluster_students(df):
    X = df[FEATURES]
    X_scaled = StandardScaler().fit_transform(X)

    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)

    df["cluster"] = clusters
    return df.groupby("cluster")[FEATURES].mean().to_dict()

def pca_analysis(df):
    X = df[FEATURES]
    X_scaled = StandardScaler().fit_transform(X)

    pca = PCA(n_components=2)
    pca.fit(X_scaled)

    return {
        "explained_variance": pca.explained_variance_ratio_.tolist()
    }
