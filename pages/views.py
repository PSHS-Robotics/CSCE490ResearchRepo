from django.conf import settings
from django.shortcuts import render


def home(request):
    return render(request, 'pages/home.html', {
        'google_maps_api_key': settings.GOOGLE_MAPS_API_KEY,
    })
