# Generated by Django 3.1.4 on 2023-02-12 20:23

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_auto_20230212_1945'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imageitem',
            name='unique_id',
        ),
        migrations.AlterField(
            model_name='imageitem',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
