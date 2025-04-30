from datetime import datetime, timedelta
from collections import defaultdict
from django.shortcuts import render
from .models import AppointmentSlot
from doctors.models import Doctor
from patients.models import Patient


def appointment_list(request):
    # Get week offset from GET param (e.g. -1, 0, +1)
    offset = int(request.GET.get('week_offset', 0))

    # Find Monday of current week + offset
    today = datetime.today().date()
    start_of_week = today - timedelta(days=today.weekday()) + timedelta(weeks=offset)
    week_dates = [start_of_week + timedelta(days=i) for i in range(7)]

    # Get all doctors
    doctors = Doctor.objects.all()

    # Get all appointments in the date range
    appointments = AppointmentSlot.objects.select_related('patient', 'doctor').filter(
        appointment_date__range=(week_dates[0], week_dates[-1])
    )

    # Build schedule dictionary: schedule[doctor.id][date] = [appointments]
    schedule = defaultdict(lambda: defaultdict(list))
    for a in appointments:
        schedule[a.doctor.id][a.appointment_date].append(a)

    context = {
        'doctors': doctors,
        'week_dates': week_dates,
        'schedule': dict(schedule),
        'current_offset': offset,
    }
    return render(request, 'appointments/appointment_list.html', context)

