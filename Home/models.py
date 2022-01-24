from django.db import models

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

