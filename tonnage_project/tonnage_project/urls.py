from django.urls import path, include

urlpatterns = [
    path('api/', include('tonnage_study.urls')),
]
