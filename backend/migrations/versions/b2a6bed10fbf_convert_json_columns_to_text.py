"""Convert JSON columns to Text

Revision ID: b2a6bed10fbf
Revises: 
Create Date: 2025-04-22 15:07:03.185195

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = 'b2a6bed10fbf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('request', schema=None) as batch_op:
        batch_op.alter_column('headers',
               existing_type=sqlite.JSON(),
               type_=sa.Text(),
               existing_nullable=True)
        batch_op.alter_column('params',
               existing_type=sqlite.JSON(),
               type_=sa.Text(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('request', schema=None) as batch_op:
        batch_op.alter_column('params',
               existing_type=sa.Text(),
               type_=sqlite.JSON(),
               existing_nullable=True)
        batch_op.alter_column('headers',
               existing_type=sa.Text(),
               type_=sqlite.JSON(),
               existing_nullable=True)

    # ### end Alembic commands ###
