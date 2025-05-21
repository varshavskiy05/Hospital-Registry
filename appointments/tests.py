from django.test import TestCase
from .models import AppointmentSlot
from doctors.models import Doctor
from patients.models import Patient
from datetime import date


class AppointmentSlotTest(TestCase):
    def test_create_slot(self):
        doctor = Doctor.objects.create(first_name="Інна", last_name="Коваль", specialty="Хірург")
        patient = Patient.objects.create(first_name="Ігор", last_name="Іваненко")
        slot = AppointmentSlot.objects.create(
            doctor=doctor,
            patient=patient,
            appointment_date=date.today()
        )
        self.assertEqual(slot.status, "scheduled")
