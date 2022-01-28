from django.http import request
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
# "python.analysis.extraPaths": ["C:/Users/adity/Desktop/Aditya/webdev/dbms/Home/views.py"]
from django.contrib import messages
from django.http import FileResponse
# import io
# from reportlab.pdfgen import canvas
from django.contrib.auth.models import User
# from reportlab.lib.units import inch
# from reportlab.lib.pagesizes import letter

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

def userauthenticate(request):
    username = request.POST['username']
    password = request.POST['password']

    user = authenticate( username = username, password = password )

    if user is not None:
        login(request,user)
        messages.add_message(request,messages.ERROR,"You are logged in")
        return redirect(homePage)

    if user is None:
        messages.add_message(request,messages.ERROR,"Invalid Credentials")
        return redirect(homePage)

def signupuser(request):
    username = request.POST['username']
    password = request.POST['password']
    repass = request.POST['psw_repeat']

    # checking various conditions before signing up the user
    if password == repass:
        if User.objects.filter(username = username).exists():
            messages.add_message(request, messages.ERROR, "User already exists")
            return redirect(homePage)

        User.objects.create_user(username = username, password = password ).save()
        messages.add_message (request, messages.SUCCESS, "User Successfully created")
    
    else:
        messages.add_message(request, messages.ERROR, "Password do not match")

    return redirect(homePage)

