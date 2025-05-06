from django.urls import path, include
from . import views


app_name = 'main'

urlpatterns = [
    path('', views.home, name='home'),
    path('appointments/', include('appointments.urls')),
    path('doctors/', include('doctors.urls')),
]