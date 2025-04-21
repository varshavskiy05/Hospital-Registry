from django.urls import path
from . import views

app_name = 'appointments'  # ← ось тут 'appointments

urlpatterns = [
    path('', views.appointment_list, name='list'),  # ← ось тут 'appointment_list'
]
