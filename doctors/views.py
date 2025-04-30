from django.shortcuts import render
from .models import Doctor
from patients.models import Patient
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from collections import defaultdict
from appointments.models import AppointmentSlot
from django.utils import timezone
from collections import defaultdict


def doctor_list(request):
    doctors_qs = Doctor.objects.all()
    patients = Patient.objects.all()

    doctors_by_specialty = defaultdict(list)
    for doc in doctors_qs:
        doctors_by_specialty[doc.specialty].append(doc)


    doctors_data = list(doctors_qs.values(
        "id", "first_name", "middle_name", "last_name", "date_of_birth",
        "specialty", "phone_number", "email", "hire_date", "fire_date", "cabinet"
    ))

    return render(request, 'doctors/doctor_list.html', {
        'doctors': doctors_data,  # для JSON
        'patients': patients,
        'doctors_by_specialty': dict(doctors_by_specialty)
    })



@csrf_exempt  # або краще CSRF через JS
def delete_doctor(request, doctor_id):
    if request.method == 'POST':
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            doctor.delete()
            return JsonResponse({'success': True})
        except Doctor.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Doctor not found'})
    return JsonResponse({'success': False, 'error': 'Invalid request'})


@csrf_exempt  # краще використовувати CSRF з JavaScript (як ми зробили)
def update_doctor(request):
    if request.method == 'POST':
        doctor_id = request.POST.get('doctor_id')
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Doctor not found'})

        doctor.first_name = request.POST.get('first_name', '')
        doctor.middle_name = request.POST.get('middle_name', '')
        doctor.last_name = request.POST.get('last_name', '')
        doctor.specialty = request.POST.get('specialty', '')
        doctor.phone_number = request.POST.get('phone_number', '')
        doctor.email = request.POST.get('email', '')
        doctor.date_of_birth = request.POST.get('date_of_birth') or None
        doctor.hire_date = request.POST.get('hire_date') or None
        doctor.fire_date = request.POST.get('fire_date') or None
        doctor.cabinet = request.POST.get('cabinet', '')

        doctor.save()
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@csrf_exempt
def create_doctor(request):
    if request.method == 'POST':
        doctor = Doctor(
            first_name=request.POST.get('first_name', ''),
            middle_name=request.POST.get('middle_name', ''),
            last_name=request.POST.get('last_name', ''),
            specialty=request.POST.get('specialty', ''),
            phone_number=request.POST.get('phone_number', ''),
            email=request.POST.get('email', ''),
            date_of_birth=request.POST.get('date_of_birth') or None,
            hire_date=request.POST.get('hire_date') or None,
            fire_date=request.POST.get('fire_date') or None,
            cabinet=request.POST.get('cabinet', '')
        )
        doctor.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})


@csrf_exempt
def create_appointment(request):
    if request.method == 'POST':
        doctor_id = request.POST.get('doctor')
        patient_id = request.POST.get('patient')
        appointment_date = request.POST.get('appointment_date')
        note = request.POST.get('note')
        patient_phone_number = request.POST.get('patient_phone_number')

        if not doctor_id or not patient_id or not appointment_date:
            return JsonResponse({'success': False, 'error': 'Missing required fields'})

        AppointmentSlot.objects.create(
            doctor_id=doctor_id,
            patient_id=patient_id,
            appointment_date=appointment_date,
            patient_phone_number =patient_phone_number,
            notes=note,
            status='scheduled'
        )
        return JsonResponse({'success': True})

    return JsonResponse({'success': False, 'error': 'Only POST allowed'})


