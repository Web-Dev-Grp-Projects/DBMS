from django.http import request
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
# "python.analysis.extraPaths": ["C:/Users/adity/Desktop/Aditya/webdev/dbms/Home/views.py"]
from django.contrib import messages
from django.contrib.auth.models import User
# from reportlab.lib.units import inch
# from reportlab.lib.pagesizes import letter
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.colors import pink, black, red, blue, green
from Home.models import *
from django.db.models import F

# Create your views here.
def homePage(request):
    if request.method == 'POST':
        pass
    else:
        return render(request, "index.html", {})

def loginPage(request):
    return render(request, "login.html", {})

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

    user = authenticate(username = username, password = password)

    if user is not None:
        login(request, user)
        messages.add_message(request, messages.SUCCESS, "You are logged in")
        return redirect(vaccineDetails)

    if user is None:
        messages.add_message(request, messages.ERROR, "Invalid Credentials")
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

        User.objects.create_user(username = username, password = password).save()
        messages.add_message(request, messages.SUCCESS, "User Successfully created")

    else:
        messages.add_message(request, messages.ERROR, "Password do not match")

    return redirect(homePage)

def logoutuser(request):
    logout(request) # logging out the user
    return redirect(homePage)

def vaccineDetails(request):
    context = {'vaccineDet':VaccineDetails.objects.all()}
    return render(request, 'display.html', context)

def book(request, bookp):
    vaccineid = bookp
    username = request
    context = {'vaccineid': vaccineid, 'username': username}
    return render(request, "form.html", context)

def bookingdone(request):
    username = request.user.username
    print(username)
    aadhar = request.POST['aadhar_number']
    name = request.POST['Name']
    date = request.POST['date']
    vaccine = request.POST['vaccineid']

    VaccineDetails.objects.filter(Vaccine_ID = vaccine).update(availability = F('availability') - 1)

    BookingDetails(username = username, aadhar = aadhar, name = name, date = date, vaccine = vaccine).save()
    messages.add_message(request, messages.SUCCESS,'Vaccine Booked Successfully')
    return redirect(customerwelcome)

def userbooking(request):
    bookings = BookingDetails.objects.filter(username = request.user.username) # getting the booking database of the particular user
    # info = VaccineDetails.objects.filter(Vaccine_ID = bookings.vaccine)  # diff bw get and filter?
    # vaccineid = info.Vaccine_ID
    context = {'bookings': bookings}
    # info = BookingDetails.objects.get(username = request.user.username) # getting the booking database of the particular user

    # print(info)

    return render(request,'userbooking.html', context)

def search(request):
    pincode = request.POST['pincode']
    context = {'vaccineDet':VaccineDetails.objects.filter(Center__pin_code = pincode)} # Filtering on the basis of foreign key atttribute
    return render(request, 'display.html', context)

def cancel(request, bookid):
    messages.add_message(request, messages.SUCCESS, "Booking successfully cancelled")
    bookings = BookingDetails.objects.filter(username = request.user.username, id = bookid)
    # print(bookings[0])
    vaccinenum = bookings[0].vaccine

    BookingDetails.objects.filter(id = bookid).delete() # cancelling the user booking by deleteing the booking from his account
    VaccineDetails.objects.filter(Vaccine_ID = vaccinenum).update(availability = F('availability') + 1)

    return redirect(userbooking)

def pdf(request):
    username = request.user.username
    # Create a file-like buffer to receive PDF data.
    buffer = io.BytesIO()
    # context = {'vaccineDet':VaccineCenterDetails.objects.all()}
    # info = BookingDetails.objects.get(username = username) # why filter doesn't work
    # vaccineid = info.Vaccine_ID
    img = './static/images/pic4.jpg'
    print(img)
    # Create the PDF object, using the buffer as its "file."
    p = canvas.Canvas(buffer)

    # See the ReportLab documentation for the full list of functionality.
    p.setFont('Helvetica-Bold', 20)
    # for context in contexts:
    #     p.drawString(100, 600, context.Center_Id)

    # p.setStrokeColor(red)
    p.setFillColor(green)
    p.drawString(100, 800, "CONGRATULATIONS "+ username + ", YOU ARE VACCINATED!") # why not commma
    # Close the PDF object cleanly, and we're done.
    p.drawImage(img, 150, 200, width = 320, preserveAspectRatio = True, mask='auto')

    p.showPage()
    p.save()

    # FileResponse sets the Content-Disposition header so that browsers present the option to save the file.
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename = 'Vaccination.pdf')

