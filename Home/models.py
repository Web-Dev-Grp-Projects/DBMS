from django.db import models
from django.contrib import admin

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    num_pages = models.IntegerField(default=0)
    publish_dat = models.DateField(blank = True, null=True)
    price = models.DecimalField(max_digits = 8, decimal_places = 2, null=True, blank=True)
    color = models.CharField(max_length=20, blank=True, null=True)
    isbn13 = models.CharField(max_length=13, blank =True, null=True)

    def __str__(self):
        return self.title

class VaccineCenterDetails(models.Model):
    Center_Id = models.IntegerField(primary_key = True)
    pin_code = models.IntegerField()
    VaccineCenterName = models.CharField(max_length = 255)
    address = models.CharField(max_length = 255)

    def __str__(self):
        return self.VaccineCenterName

class VaccineDetails(models.Model):
    Vaccine_ID = models.IntegerField(primary_key = True)
    Center_Id = models.ForeignKey(VaccineCenterDetails, on_delete = models.CASCADE)
    type_of_vaccine = models.CharField(max_length = 255)
    availability = models.IntegerField()
    address = models.CharField(max_length = 255)

    def __str__(self):
            return self.type_of_vaccine
