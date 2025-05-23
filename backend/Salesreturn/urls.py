from django.urls import path
from .views import ReturnCreateView,ReturnListView

urlpatterns = [
    # Endpoint for creating a return
    path("salesreturn/", ReturnCreateView.as_view(), name="create-return"),
    path('returns/', ReturnListView.as_view(), name='return-list'),
]
