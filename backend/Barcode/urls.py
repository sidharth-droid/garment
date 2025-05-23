# barcode_app/urls.py
from django.urls import path
# from .views import GenerateBarcodeView,GetBarcodeDetailsView,BarcodeFetchView
from .views import (GenerateBarcodeView,GetBarcodeDetailsView,BarcodeFetchView,
                    BarcodeDetailsView,GenerateBarcodeViewTest,BarcodeVerifyView)

urlpatterns = [
    #path('generate-barcode/', BarcodeGenerateAPIView.as_view(), name='generate-barcode'),
    path("code/", GenerateBarcodeView.as_view(), name="generate_barcode"),
    path('get-barcode-details/<str:barcode>/', GetBarcodeDetailsView.as_view(), name='get-barcode-details'),
    path('barcode-fetch/', BarcodeFetchView.as_view(), name='barcode-fetch'),
     path('barcode-details/',BarcodeDetailsView.as_view(),name="barcode-details"),
    path("code-test/", GenerateBarcodeViewTest.as_view(), name="generate-barcode-test"),
    path("barcode-verify/", BarcodeVerifyView.as_view(), name="barcode-verify"),
]
