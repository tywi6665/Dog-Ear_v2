# Generated by Django 3.1.4 on 2023-02-14 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0020_auto_20230214_0505'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imageitem',
            name='unique_id',
            field=models.CharField(max_length=100, null=True, unique=True),
        ),
    ]
