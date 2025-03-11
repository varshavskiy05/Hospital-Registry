from django.db import models
from doctors.models import Doctor
from patients.models import Patient
from datetime import datetime


class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    reason_for_visit = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('scheduled', 'Scheduled'),
            ('cancelled', 'Cancelled'),
            ('completed', 'Completed'),
        ],
        default='scheduled'
    )
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.patient} on {self.appointment_date} with {self.doctor}"