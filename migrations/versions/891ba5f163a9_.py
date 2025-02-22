"""empty message

Revision ID: 891ba5f163a9
Revises: 4c28ad34d9df
Create Date: 2025-02-16 22:04:00.089731

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '891ba5f163a9'
down_revision = '4c28ad34d9df'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('exchangelist', schema=None) as batch_op:
        batch_op.alter_column('origin_disc_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('target_disc_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('exchangelist', schema=None) as batch_op:
        batch_op.alter_column('target_disc_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('origin_disc_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
