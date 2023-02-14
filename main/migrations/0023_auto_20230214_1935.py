# Generated by Django 3.1.4 on 2023-02-14 19:35

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0022_auto_20230214_0507'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imageitem',
            name='unique_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]