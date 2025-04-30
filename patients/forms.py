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