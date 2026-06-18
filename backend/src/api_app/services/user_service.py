from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.shared.database import get_db
from src.shared.models import AnalysisResult, AnalysisRun, Dataset, Product, Review, UserProfile
from src.shared.storage import get_supabase_service_client, upload_avatar_file


def get_profile(db: Session, user_id: str) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile tidak ditemukan")
    return profile


def update_profile(db: Session, user_id: str, store_name: str, email: str | None = None) -> UserProfile:
    profile = get_profile(db, user_id)
    profile.store_name = store_name
    
    if email and email != profile.email:
        client = get_supabase_service_client()
        try:
            # Menggunakan admin API untuk update email langsung
            client.auth.admin.update_user_by_id(user_id, {"email": email})
            profile.email = email
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Gagal mengupdate email di sistem: {e}")
            
    db.commit()
    db.refresh(profile)
    return profile


def upload_avatar(db: Session, user_id: str, file_name: str, content: bytes) -> str:
    # Validasi 5MB
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran foto maksimal 5 MB.")
        
    public_url = upload_avatar_file(content=content, file_name=file_name, user_id=user_id)
    
    profile = get_profile(db, user_id)
    profile.profile_image_url = public_url
    db.commit()
    return public_url


def change_password(user_id: str, email: str, old_password: str, new_password: str) -> None:
    client = get_supabase_service_client()
    try:
        # 1. Validasi password lama dengan mencoba login
        res = client.auth.sign_in_with_password({"email": email, "password": old_password})
        if not res.session:
            raise ValueError("Password lama tidak sesuai.")
            
        # 2. Update password
        client.auth.admin.update_user_by_id(user_id, {"password": new_password})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal mengubah password: {str(e)}")


def clear_user_data(db: Session, user_id: str) -> None:
    products = db.query(Product).filter(Product.user_id == user_id).all()
    product_ids = [p.id for p in products]
    
    if product_ids:
        datasets = db.query(Dataset).filter(Dataset.product_id.in_(product_ids)).all()
        dataset_ids = [d.id for d in datasets]
        
        runs = db.query(AnalysisRun).filter(AnalysisRun.product_id.in_(product_ids)).all()
        run_ids = [r.id for r in runs]
        
        # Eksekusi Delete
        if run_ids:
            db.query(AnalysisResult).filter(AnalysisResult.analysis_run_id.in_(run_ids)).delete(synchronize_session=False)
            db.query(AnalysisRun).filter(AnalysisRun.id.in_(run_ids)).delete(synchronize_session=False)
            
        if dataset_ids:
            db.query(Review).filter(Review.dataset_id.in_(dataset_ids)).delete(synchronize_session=False)
            db.query(Dataset).filter(Dataset.id.in_(dataset_ids)).delete(synchronize_session=False)
            
        db.query(Product).filter(Product.id.in_(product_ids)).delete(synchronize_session=False)
        db.commit()


def delete_user_account(db: Session, user_id: str) -> None:
    client = get_supabase_service_client()
    try:
        # Hapus data tabel child
        clear_user_data(db, user_id)
        
        # Hapus profile database
        db.query(UserProfile).filter(UserProfile.user_id == user_id).delete(synchronize_session=False)
        db.commit()
        
        # Hapus dari Auth Supabase
        client.auth.admin.delete_user(user_id)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Gagal menghapus akun: {str(e)}")
