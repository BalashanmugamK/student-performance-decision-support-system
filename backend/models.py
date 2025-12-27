from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///../data/students.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    studytime = Column(Float)
    absences = Column(Float)
    G1 = Column(Float)
    G2 = Column(Float)
    failures = Column(Float)
    risk_level = Column(String)
    predicted_grade = Column(Float)

# Create the table if it doesn't exist
Base.metadata.create_all(bind=engine)
