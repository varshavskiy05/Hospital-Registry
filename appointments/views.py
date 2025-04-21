from django.shortcuts import render



def appointment_list(request):
    # This view will handle the logic for listing appointments
    return render(request, 'appointments/appointment_list.html')