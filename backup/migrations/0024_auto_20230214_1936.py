# Generated by Django 3.1.4 on 2023-02-14 19:36

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0023_auto_20230214_1935'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='imageitem',
            name='id',
        ),
        migrations.AlterField(
            model_name='imageitem',
            name='unique_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
