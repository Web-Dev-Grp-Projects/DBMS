from django.db import models
from django.contrib import admin

# Create your models here.
class VaccineCenterDetails(models.Model):
    Center_Id = models.IntegerField(primary_key = True)
    pin_code = models.IntegerField()
    VaccineCenterName = models.CharField(max_length = 255)
    address = models.CharField(max_length = 255)

    def __str__(self):
        return self.VaccineCenterName

class VaccineDetails(models.Model):
    Vaccine_ID = models.IntegerField(primary_key = True)
    Center = models.ForeignKey(VaccineCenterDetails, on_delete = models.CASCADE)
    type_of_vaccine = models.CharField(max_length = 255)
    availability = models.IntegerField()
 
    def __str__(self):
            return self.type_of_vaccine

class BookingDetails(models.Model):
    username = models.CharField(max_length=255)
    aadhar = models.BigIntegerField()
    name = models.CharField(max_length = 255)
    # vaccine = models.ForeignKey(VaccineDetails, on_delete = models.CASCADE)
    vaccine = models.IntegerField()
    status = models.BooleanField(default = False)
    date = models.DateField()
    
    def __str__(self):
            return self.username