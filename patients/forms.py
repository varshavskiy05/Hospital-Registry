from django import forms
from .models import Patient


class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields ='__all__'
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
            'admit_date': forms.DateInput(attrs={'type': 'date'}),
            'admit_time': forms.TimeInput(attrs={'type': 'time'}),
            'discharge_date': forms.DateInput(attrs={'type': 'date'}),
        }
        labels = {
            'first_name': "Ім'я",
            'middle_name': "По батькові",
            'last_name': "Прізвище",
            'phone_number': "Телефон",
            'email': "Email",
            'date_of_birth': "Дата народження",
            'admit_date': "Дата госпіталізації",
            'admit_time': "Час госпіталізації",
            'discharge_date': "Дата виписки",
        }