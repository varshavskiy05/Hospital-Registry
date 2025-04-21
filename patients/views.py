from django.shortcuts import render
from .models import Patient


def patient_list(request):
    patients = list(Patient.objects.values("first_name", "last_name", "date_of_birth"))
    return render(request, 'patients/patient_list.html', {'patients': patients})
