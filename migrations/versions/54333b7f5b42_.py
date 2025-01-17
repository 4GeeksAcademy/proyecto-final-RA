"""empty message

Revision ID: 54333b7f5b42
Revises: 1e7e2623784e
Create Date: 2025-01-17 17:09:25.374370

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '54333b7f5b42'
down_revision = '1e7e2623784e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.alter_column('owner_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('records', schema=None) as batch_op:
        batch_op.alter_column('owner_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###