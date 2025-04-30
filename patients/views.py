from django.shortcuts import render, redirect, get_object_or_404
from .models import Patient
from .forms import PatientForm
from django.http import JsonResponse


def patient_list(request):
    patients = list(Patient.objects.values(
        "id", "first_name", "middle_name", "last_name", "phone_number", "email",
        "date_of_birth", "admit_date", "admit_time", "discharge_date"
    ))
    form = PatientForm()
    return render(request, 'patients/patient_list.html', {'patients': patients, 'form': form})


def add_or_update_patient(request):
    if request.method == 'POST':
        patient_id = request.POST.get('patient_id')
        if patient_id:  # Если передан id — редактируем существующего пациента
            patient = get_object_or_404(Patient, pk=patient_id)
            form = PatientForm(request.POST, instance=patient)
        else:  # Иначе — создаем нового
            form = PatientForm(request.POST)

        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        return JsonResponse({'success': False, 'errors': 'Invalid request method'})


def delete_patient(request, patient_id):
    if request.method == 'POST':
        patient = get_object_or_404(Patient, pk=patient_id)
        patient.delete()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})
