# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('save-data/', views.save_data, name='save_data'),
    path('get-session-data/<str:session_name>/', views.get_session_data, name='get_session_data'),
]
