from django.http import request
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
# "python.analysis.extraPaths": ["C:/Users/adity/Desktop/Aditya/webdev/dbms/Home/views.py"]
from django.contrib import messages
from django.contrib.auth.models import User
# from reportlab.lib.units import inch
# from reportlab.lib.pagesizes import letter

from Home.models import *

# Create your views here.
def homePage(request):
    if request.method == 'POST':
        pass
    else:
        return render(request, "index.html", {})

def adminHomePage(request):
    return render(request, "adminhomepage.html", {})

def loginPage(request):
    return render(request, "login.html", {})

def test(request):
    return render(request, "test.html", {})

def form(request):
    return render(request, "form.html", {})

def customerwelcome(request):
    if not request.user.is_authenticated:
        return redirect(homePage)

    username = request.user.username
    context = {'username': username, 'hotels': VaccineCenterDetails.objects.all()}
    return render(request, 'customerwelcome.html', context)

def userauthenticate(request):
    username = request.POST['username']
    password = request.POST['password']

    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        messages.add_message(request, messages.ERROR, "You are logged in")
        return redirect(customerwelcome)

    if user is None:
        messages.add_message(request, messages.ERROR, "Invalid Credentials")
        return redirect(homePage)

def signupuser(request):
    username = request.POST['username']
    password = request.POST['password']
    repass = request.POST['psw_repeat']

    # checking various conditions before signing up the user
    if password == repass:
        if User.objects.filter(username=username).exists():
            messages.add_message(request, messages.ERROR, "User already exists")
            return redirect(homePage)

        User.objects.create_user(username=username, password=password).save()
        messages.add_message(request, messages.SUCCESS, "User Successfully created")

    else:
        messages.add_message(request, messages.ERROR, "Password do not match")

    return redirect(homePage)

def logoutuser(request):
    logout(request) # logging out the user
    return redirect(homePage)

def vaccineDetails(request):
    context = {'vaccineDet':VaccineCenterDetails.objects.all()}
    return render(request, 'display.html', context)

def userbooking(request):
    bookings = Book.objects.filter(username = request.user.username) # getting the booking database of the particular user
    context = {'bookings': bookings }
    return render(request,'userbooking.html', context)


import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.colors import pink, black, red, blue, green

def pdf(request):
    # Create a file-like buffer to receive PDF data.
    buffer = io.BytesIO()
    # context = {'vaccineDet':VaccineCenterDetails.objects.all()}
    contexts = VaccineCenterDetails.objects.all()

    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer)

    # See the ReportLab documentation for the full list of functionality.
    p.setFont('Helvetica-Bold', 20)
    # for context in contexts:
    #     p.drawString(100, 600, context.Center_Id)

    # p.setStrokeColor(red)
    p.setFillColor(green)
    p.drawString(100, 600, "CONGRATULATIONS, YOU ARE VACCINATED!")
    # Close the PDF object cleanly, and we're done.
    p.showPage()
    p.save()

    # FileResponse sets the Content-Disposition header so that browsers present the option to save the file.
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename = 'Vaccination.pdf')