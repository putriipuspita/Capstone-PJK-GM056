import sys
from pathlib import Path

# Setup sys.path agar bisa import module src
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from src.shared.database import SessionLocal
from src.shared.models import AnalysisRun, Review

def run():
    db = SessionLocal()
    runs = db.query(AnalysisRun).all()
    count = 0

    for run in runs:
        if not run.result:
            continue
        
        # Ambil ulasan dari database
        reviews = db.query(Review).filter(Review.dataset_id == run.dataset_id).all()
        
        valid_ratings = []
        for r in reviews:
            if r.rating is not None:
                valid_ratings.append(float(r.rating))
        
        average_rating = 0.0
        if valid_ratings:
            average_rating = round(sum(valid_ratings) / len(valid_ratings), 1)
        
        # Update summary dict
        summary_dict = run.result.summary.copy() if run.result.summary else {}
        summary_dict["average_rating"] = average_rating
        
        # Di SQLAlchemy JSON column, kita harus mereassign dictionary baru agar terdeteksi perubahan
        run.result.summary = summary_dict
        count += 1
        print(f"Updated AnalysisRun {run.id}: average_rating = {average_rating}")

    db.commit()
    db.close()
    print(f"Selesai! {count} data berhasil diperbarui.")

if __name__ == "__main__":
    run()
