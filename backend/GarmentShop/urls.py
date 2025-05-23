"""
URL configuration for GarmentShop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include, re_path
from pathlib import Path
import os
from django.views.static import serve as static_serve
from django.views.generic import TemplateView
BASE_DIR = Path(__file__).resolve().parent.parent

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/',include('GarmentShopAPI.urls')),
    path('api/barcode/', include('Barcode.urls')),
    path('api/purchase/',include('Purchasedetails.urls')),
    path('api/retailsale/',include('RetailSale.urls')),
    path('api/bulksale/',include('Bulksale.urls')),
    path('api/userrole/',include('Userdetails.urls')),
    path('api/garmentmodule/',include('Garmentmodules.urls')),
    path('api/salesreturn/',include('Salesreturn.urls')),
    path('api/salestarget/',include('Salestarget.urls')),
    

]

urlpatterns+=[
    re_path(r'^(?:.*)/assets/(?P<path>.*)$', static_serve, {
        'document_root': os.path.join(BASE_DIR, '../frontend/build/assets'),
    }),
    re_path(r'^assets/(?P<path>.*)$', static_serve, {
        'document_root': os.path.join(BASE_DIR, '../frontend/build/assets'),
    }),

    re_path(r'^.*$',TemplateView.as_view(
        template_name='index.html'),name='index')
]