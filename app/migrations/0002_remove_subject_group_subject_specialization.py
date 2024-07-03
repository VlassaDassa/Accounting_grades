# Generated by Django 5.0.4 on 2024-06-07 13:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subject',
            name='group',
        ),
        migrations.AddField(
            model_name='subject',
            name='specialization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.specialization'),
        ),
    ]
