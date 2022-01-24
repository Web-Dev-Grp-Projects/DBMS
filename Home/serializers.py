from rest_framework import serializers
from .models import *

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['pk', 'title', 'num_pages', 'publish_dat', 'price', 'color', 'isbn13']
        extra_kwargs = {
            'publish_dat': {"required":False},
            'price': {"required":False},
            'color': {"required":False},
            'isbn13': {"required":False}
        }