# Student Performance Decision Support System

## 📌 Overview
This project implements a web-based, machine learning–driven decision support system for analyzing student academic performance and feedback data. The system applies data science techniques to identify at-risk students, uncover performance patterns, and support data-driven academic decision-making through interactive visualizations.

---

## 🎯 Objectives
* **Analyze structured student performance data** using data science methods.
* **Apply machine learning models** for risk prediction and performance estimation.
* **Perform clustering and dimensionality reduction** to discover hidden patterns.
* **Demonstrate text analytics** on student feedback data.
* **Develop an interactive web interface** using modern web technologies.

---

## 📂 Datasets Used
### Structured Dataset
* **UCI Student Performance Dataset**: Attributes include attendance, study time, internal assessments, and final grades.

### Unstructured Dataset
* **Student / Course Feedback Dataset (Kaggle)**: Contains short textual feedback used for text analytics.

> [!NOTE]
> The datasets are conceptually related to the education domain and are not joined at the record level.

---

## 🧠 Data Science Techniques Used
* **Data Preprocessing**: Cleaning, handling missing values, and normalization.
* **Exploratory Data Analysis (EDA)**: Visualizing trends and correlations.
* **Supervised Learning**:
    * Logistic Regression
    * Decision Tree
    * Random Forest
* **Unsupervised Learning**:
    * K-Means Clustering
* **Dimensionality Reduction**:
    * Principal Component Analysis (PCA)
* **Text Analytics**:
    * Text cleaning and tokenization
    * TF-IDF representation
    * Sentiment analysis / Topic clustering

---

## 🌐 Web Application Features
* **Dataset Upload Interface**: Seamless CSV/Data ingestion.
* **Model Selection**: Toggle between different ML algorithms.
* **Interactive Dashboards**: Real-time views for predictions, clusters, and PCA results.
* **Dynamic Visualizations**: Responsive charts for analytics outputs.

---

## 🛠️ Tech Stack
| Category | Tools & Technologies |
| :--- | :--- |
| **Data Science & ML** | Python, NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn |
| **Database** | MySQL, SQLite, SQL |
| **Web Programming** | HTML5, CSS3, JavaScript (ES6+), ReactJS (Hooks, State) |
| **Visualization** | Tableau, Chart.js / D3.js |

---

## 📊 Project Structure
```
student-performance-decision-support-system/
├── frontend/                # ReactJS application source code
├── notebooks/               # Jupyter notebooks for EDA and ML modeling
├── data/                    # CSV datasets (UCI and Kaggle)
├── sql/                     # Database schemas and SQL scripts
├── requirements.txt         # Project dependencies (Python)
├── README.md                # Project documentation
└── .env                     # Optional: Database credentials / API keys
```

---

## 📈 Outcome
The system provides interpretable insights such as risk categorization, student clusters, dominant performance factors, and sentiment trends in feedback data. These insights support informed academic intervention and decision-making.

---

## 📚 Academic Context
This project was developed as part of the **BCSE206L: Foundations of Data Science** and **BCSE203E: Web Programming** courses.
