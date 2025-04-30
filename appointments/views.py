from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import AppointmentSlot



def appointment_list(request):
    # This view will handle the logic for listing appointments
    return render(request, 'appointments/appointment_list.html')


