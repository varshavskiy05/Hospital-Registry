from django.urls import path
from . import views

app_name = 'doctors'

urlpatterns = [
    path('', views.doctor_list, name='list'),
    path('delete/<int:doctor_id>/', views.delete_doctor, name='delete_doctor'),
    path('update/', views.update_doctor, name='update_doctor'),
    path('create/', views.create_doctor, name='create_doctor'),
    path('appointments/create/', views.create_appointment, name='appointments_create'),
]