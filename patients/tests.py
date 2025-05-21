from django.test import TestCase
from .models import Patient


class PatientModelTest(TestCase):
    def test_create_patient(self):
        patient = Patient.objects.create(
            first_name="Тест",
            last_name="Пацієнт",
            phone_number="0991234567"
        )
        self.assertEqual(str(patient), "Тест Пацієнт")
