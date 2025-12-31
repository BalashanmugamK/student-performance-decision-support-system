from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

def cluster_students(df):
    X = df.select_dtypes(include="number")
    X_scaled = StandardScaler().fit_transform(X)

    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)

    counts = {}
    for c in clusters:
        counts[c] = counts.get(c, 0) + 1

    return {
        "labels": [f"Cluster {k}" for k in sorted(counts.keys())],
        "values": [counts[k] for k in sorted(counts.keys())]
    }

def pca_analysis(df):
    X = df.select_dtypes(include="number")
    X_scaled = StandardScaler().fit_transform(X)

    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)

    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    return {
        "variance": pca.explained_variance_ratio_.round(3).tolist(),
        "points": [
            {
                "x": float(X_pca[i, 0]),
                "y": float(X_pca[i, 1]),
                "cluster": int(clusters[i])
            }
            for i in range(len(X_pca))
        ]
    }
