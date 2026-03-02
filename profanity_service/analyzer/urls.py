from django.urls import path
from .views import AnalyzeMessageView

urlpatterns = [
    path('analyze/', AnalyzeMessageView.as_view(), name='analyze-message'),
]