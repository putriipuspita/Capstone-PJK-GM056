"""add refresh session metadata

Revision ID: 20260615_0005
Revises: 20260615_0004
Create Date: 2026-06-15
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260615_0005"
down_revision: Union[str, None] = "20260615_0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("refresh_token_sessions", sa.Column("ip_address", sa.String(length=100), nullable=True))
    op.add_column("refresh_token_sessions", sa.Column("user_agent", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("refresh_token_sessions", "user_agent")
    op.drop_column("refresh_token_sessions", "ip_address")
