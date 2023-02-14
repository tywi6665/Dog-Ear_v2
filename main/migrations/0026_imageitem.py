# Generated by Django 3.1.4 on 2023-02-14 20:45

from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0025_auto_20230214_2006'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageItem',
            fields=[
                ('unique_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
