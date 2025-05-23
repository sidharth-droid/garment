from django.db import models

# Create your models here.
class SalesTarget(models.Model):
    daily = models.PositiveIntegerField(default=0)
    monthly = models.PositiveIntegerField(default=0)
    yearly = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"SalesTarget(daily={self.daily}, monthly={self.monthly}, yearly={self.yearly})"