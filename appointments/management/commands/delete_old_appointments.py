from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from ...models import AppointmentSlot

class Command(BaseCommand):
    help = 'Видаляє записи, старші за 5 років від дати прийому'

    def handle(self, *args, **kwargs):
        cutoff_date = datetime.today().date() - timedelta(days=5 * 365)
        deleted_count, _ = AppointmentSlot.objects.filter(appointment_date__lt=cutoff_date).delete()
        self.stdout.write(self.style.SUCCESS(f"✅ Видалено {deleted_count} записів, старших за 5 років."))
