# urls.py
from django.urls import path
from .views import SalesTargetRetrieveView, SalesTargetCreateView, SalesTargetUpdateView

urlpatterns = [
    path('salestargets/', SalesTargetRetrieveView.as_view(), name='sales-targets-retrieve'),
    path('salestargets/create/', SalesTargetCreateView.as_view(), name='sales-targets-create'),
    path('salestargets/update/', SalesTargetUpdateView.as_view(), name='sales-targets-update'),
]
