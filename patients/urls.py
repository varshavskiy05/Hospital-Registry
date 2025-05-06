from django.urls import path
from . import views

app_name = 'patients'

urlpatterns = [
    path('', views.patient_list, name='list'),
    path('add_or_update/', views.add_or_update_patient, name='add_or_update_patient'),
    path('delete/<int:patient_id>/', views.delete_patient, name='delete_patient'),
]
