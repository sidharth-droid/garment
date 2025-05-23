# barcode_app/models.py
from django.db import models

class BarcodeItem(models.Model):
    item_name = models.CharField(max_length=255)
    description = models.TextField()
    size = models.CharField(max_length=50)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    # barcode = models.ImageField(upload_to='barcodes/', blank=True, null=True)

    def __str__(self):
        return self.item_name


class BarcodeGen(models.Model):
    shop_name = models.CharField(max_length=25)
    category_name = models.CharField(max_length=100)  # New field
    sub_category = models.CharField(max_length=100,default='na',blank=True, null=True)
    item_name = models.CharField(max_length=100)
    item_size = models.CharField(max_length=10)
    item_price = models.DecimalField(max_digits=100, decimal_places=2)
    serial_number = models.CharField(max_length=20, unique=True)
    barcode_image = models.ImageField(upload_to='barcodes/')
    barcode_image_base64 = models.TextField() 

    def __str__(self):
        return f"{self.item_name} - {self.serial_number}"
    
class BarcodeVerify(models.Model):
    item_name = models.CharField(max_length=100)
    category_name = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100,default='na',blank=True, null=True)
    item_size = models.CharField(max_length=10)
    quantity = models.IntegerField(default=0)
    date_verified = models.DateTimeField(auto_now_add=True)
    barcodes = models.ManyToManyField(BarcodeGen)
   
