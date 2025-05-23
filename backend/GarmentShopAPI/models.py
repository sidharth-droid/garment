from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.core.validators import RegexValidator, EmailValidator
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self,user_name, password=None,password2=None,**extra_fields):
        """
        Creates and saves a User with the given user_name and password.
        """
        if not user_name:
            raise ValueError("Users must have an user_name")
        user = self.model(
            user_name=user_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,user_name, password=None):
        """
        Creates and saves a User with the given user_name and password.
        """
        user = self.create_user(
            user_name=user_name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser):
    user_name = models.CharField(max_length=100,unique=True)
    fullname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,unique=True)
    contact_number = models.CharField(max_length=20,unique=True)
    role = models.CharField(max_length=100)
    description = models.CharField(max_length=100,null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    objects = UserManager()
    USERNAME_FIELD = "user_name"

    def __str__(self):
        return self.user_name

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
   
    
#Company Creation
class Company(models.Model):
    company_name = models.CharField(max_length=255)
    gst = models.CharField(max_length=15)  # Removed regex validator
    pan = models.CharField(max_length=10)  # Removed regex validator
    phone = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^\d{10}$', message="Enter a valid 10-digit phone number")]
    )
    email = models.EmailField(
        validators=[EmailValidator(message="Enter a valid email address")]
    )
    address = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)  # Set default value for existing rows


    def __str__(self):
        return self.company_name

#Catagory Creation
class Category(models.Model):
    category_code = models.CharField(max_length=20, unique=True)
    category_name = models.CharField(max_length=50,unique=True)
    description = models.TextField()
    
    # Subcategories should be stored in a Many-to-Many relationship
    sub_category_name = models.ManyToManyField('SubCategory')

    def __str__(self):
        return self.category_name


class SubCategory(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    
    

#Item Creation

class Item(models.Model):
    
    item_name = models.CharField(max_length=255)
    item_code = models.CharField(max_length=100, unique=True,blank=True, null=True)
    category_name = models.CharField(max_length=255, default='default_category')
    sub_category=models.CharField(max_length=70,null=True,blank=True)
    hsn_code = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  # Set default value for existing rows

    def __str__(self):
        return self.item_name
    
class ItemSize(models.Model):
    item = models.ForeignKey(Item, related_name="sizes", on_delete=models.CASCADE)
    size = models.CharField(max_length=20)
    stock_quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.size} - {self.stock_quantity}"

class StockHistory(models.Model):
    item_size = models.ForeignKey(ItemSize, related_name="stock_history", on_delete=models.CASCADE)
    change_date = models.DateTimeField(default=timezone.now)  # Date and time of the stock change
    change_quantity = models.IntegerField()  # Quantity before the change

    def __str__(self):
        return f"History for {self.item_size.item.item_name} - {self.item_size.size} on {self.change_date}"

    
#Design Creation
class Design(models.Model):
    design_name = models.CharField(max_length=100)
    design_code = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    associated_items = models.JSONField(default=list)
    created_at = models.DateTimeField(default=timezone.now)  # Set default value for existing rows

    def __str__(self):
        return self.design_name
#Party Details
class Party(models.Model):
    VENDOR = 'Vendor'
    SUPPLIER = 'Supplier'
    CUSTOMER = 'Customer'
    
    PARTY_TYPES = [
        (VENDOR, 'Vendor'),
        (SUPPLIER, 'Supplier'),
        (CUSTOMER, 'Customer'),
    ]

    party_name = models.CharField(max_length=255,unique=True)
    party_type = models.CharField(max_length=20, choices=PARTY_TYPES)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    gst_number = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  # Set default value for existing rows

    def __str__(self):
        return self.party_name
#Tax Creation
class Tax(models.Model):
    TAX_CHOICES = [
        ('CGST', 'Central GST'),
        ('SGST', 'State GST'),
        ('IGST', 'Integrated GST')
    ]
    
    tax_name = models.CharField(max_length=50, choices=TAX_CHOICES)
    tax_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Enter the tax percentage (0-100%)"
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  # Set default value for existing rows

    def __str__(self):
        return f"{self.tax_name} ({self.tax_percentage}%)"
#Financial Year Model
class FinancialYear(models.Model):
    financial_year_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.BooleanField(default=True)  # Active/Inactive
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  # Set default value for existing rows

    def __str__(self):
        return self.financial_year_name


