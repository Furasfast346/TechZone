from django.db import models


class Products(models.Model):
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    image = models.CharField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'products'

    def __str__(self):
        return f"{self.name} ({self.brand})"