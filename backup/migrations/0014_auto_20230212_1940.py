# Generated by Django 3.1.4 on 2023-02-12 19:40

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_remove_imageitem_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imageitem',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]
