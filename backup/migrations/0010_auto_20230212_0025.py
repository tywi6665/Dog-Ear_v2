# Generated by Django 3.1.4 on 2023-02-12 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20210510_2112'),
    ]

    operations = [
        migrations.AddField(
            model_name='crawledrecipeitem',
            name='ingredients',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='crawledrecipeitem',
            name='steps',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='recipeitem',
            name='ingredients',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='recipeitem',
            name='steps',
            field=models.TextField(blank=True),
        ),
    ]
