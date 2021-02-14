# Generated by Django 3.1.4 on 2021-02-01 00:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_crawledrecipeitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipeitem',
            name='img_src',
            field=models.CharField(blank=True, max_length=300),
        ),
        migrations.AlterField(
            model_name='recipeitem',
            name='title',
            field=models.CharField(max_length=300),
        ),
        migrations.AlterField(
            model_name='recipeitem',
            name='url',
            field=models.CharField(max_length=300),
        ),
    ]