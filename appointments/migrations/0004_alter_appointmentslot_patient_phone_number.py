# Generated by Django 5.1.6 on 2025-04-30 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0003_remove_appointmentslot_reason_for_visit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointmentslot',
            name='patient_phone_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
