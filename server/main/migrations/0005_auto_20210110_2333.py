# Generated by Django 3.1.4 on 2021-01-10 23:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20210110_2310'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipeitem',
            name='notes',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='recipeitem',
            name='tags',
            field=models.JSONField(default=list),
        ),
    ]
