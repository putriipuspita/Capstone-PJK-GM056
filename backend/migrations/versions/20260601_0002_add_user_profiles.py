"""add user profiles and testimonials

Revision ID: 20260601_0002
Revises: 20260601_0001
Create Date: 2026-06-01
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260601_0002"
down_revision: Union[str, None] = "20260601_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_profiles",
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("store_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("profile_image_url", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("user_id"),
        sa.UniqueConstraint("email"),
    )
    op.add_column("products", sa.Column("user_id", sa.String(length=36), nullable=False))
    op.create_foreign_key(
        "fk_products_user_id_user_profiles",
        "products",
        "user_profiles",
        ["user_id"],
        ["user_id"],
    )
    op.create_table(
        "testimonials",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("is_published", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user_profiles.user_id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("testimonials")
    op.drop_constraint("fk_products_user_id_user_profiles", "products", type_="foreignkey")
    op.drop_column("products", "user_id")
    op.drop_table("user_profiles")
