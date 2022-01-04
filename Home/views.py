from django.http import request
from django.shortcuts import render
# "python.analysis.extraPaths": ["C:/Users/adity/Desktop/Aditya/webdev/dbms/Home/views.py"]

from django.http import FileResponse
import io
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter

# Create your views here.
def homePage(request):
    if request.method == 'POST':
        pass
    else:
        return render(request, "index.html", {})

def adminHomePage(request):
    return render(request, "adminhomepage.html", {})

