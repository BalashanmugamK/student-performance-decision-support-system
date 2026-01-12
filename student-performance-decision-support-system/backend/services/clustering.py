from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

def cluster_students(df):
    X = df.select_dtypes(include="number")
    X_scaled = StandardScaler().fit_transform(X)

    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)

    # RETURN PER-STUDENT CLUSTER
    return [
        {
            "student_id": i,
            "cluster": int(clusters[i])
        }
        for i in range(len(clusters))
    ]
