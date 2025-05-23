
import random
import io,os,re
import base64
from django.db import transaction
from django.db.models import Sum
from datetime import datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import BarcodeGen,BarcodeVerify
from GarmentShopAPI.models import Item
from .serializers import BarcodeItemSerializer,BarcodeSerializer,BarcodeDetailsSerializer
from rest_framework.permissions import IsAuthenticated 
from .renderers import UserRenderer
import barcode
from django.http import JsonResponse
from barcode.writer import ImageWriter
from io import BytesIO
from django.core.files.base import ContentFile
from barcode import Code128
from PIL import Image, ImageDraw, ImageFont
import random
import json
from django.views.decorators.csrf import csrf_exempt
from sms import send_sms


class GenerateBarcodeView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            # Parse JSON data
            data = request.data
            item_name = data.get("item_name")
            item_size = data.get("item_size")
            item_price = data.get("item_price")
            shop_name = data.get("shop_name")
            category_name = data.get("category_name")  # New field
            sub_category = data.get("sub_category")
            quantity = data.get("quantity", 1)  # Default to 1 if not provided

            # Validate shop_name length
            if len(shop_name) > 25:
                raise ValueError("shop_name cannot exceed 25 characters.")

            response_data = []
            current_date = datetime.now().strftime("%d")
            sequential_number = 1

            for _ in range(quantity):
                # Generate a unique serial number based on shop name, item size, and a random number
                serial_number = f"{shop_name[:2].upper()}{item_size.upper()}{current_date}{sequential_number:04d}"
                sequential_number += 1

                # Generate the barcode image
                barcode = Code128(serial_number, writer=ImageWriter())
                barcode_image = barcode.render(writer_options={
                    "font_size": 1,
                    "text_distance": 1,
                    "module_width": 0.2,  
                    "module_height": 5,
                    "write_text": False
                })

                # Create a blank image for adding additional text
                width, height = barcode_image.size
                new_image = Image.new("RGB", (width + 40, height + 100), "white")
                new_image.paste(barcode_image, (20, 80))

                # Add text to the image
                draw = ImageDraw.Draw(new_image)
                try:
                    font = ImageFont.truetype("arial.ttf", 15)
                    font_bold = ImageFont.truetype("arialbd.ttf", 15)
                except IOError:
                    font = ImageFont.load_default()
                    font_bold = font

                # Format category_name for display
                formatted_category = f"{category_name.upper()}_{item_name.upper()}"
                shop_name_width, _ = draw.textbbox((0, 0), shop_name, font=font_bold)[2:]

                draw.text((20, 35), formatted_category, font=font, fill="black")
                draw.text((20, 50), f"Size : {item_size}", font=font, fill="black")
                draw.text((20, 65), f"Price: {item_price}/-", font=font, fill="black")
                draw.text((width - shop_name_width, 10), shop_name.upper(), font=font_bold, fill="black")
                draw.text((width // 2 - 15, height + 70), serial_number.upper(), font=font, fill="black")

                # Save barcode to in-memory file
                buffer = io.BytesIO()
                new_image.save(buffer, "PNG")
                buffer.seek(0)

                # Encode the image to Base64 (Modified line)
                encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')  # Added for Base64 encoding

                # Save barcode image and details to the database
                barcode_instance = BarcodeGen(
                    shop_name=shop_name,
                    category_name=category_name,
                    item_name=item_name,
                    item_size=item_size,
                    item_price=item_price,
                    sub_category=sub_category,
                    serial_number=serial_number,
                    barcode_image_base64=encoded_image 
                )
                barcode_instance.barcode_image.save(f"{serial_number}.png", ContentFile(buffer.read()))
                barcode_instance.save()

                # Serialize barcode instance
                serializer = BarcodeSerializer(barcode_instance)

                # Add Base64 encoded image to the response (Modified line)
                serialized_data = serializer.data  # Retrieve serialized data
                serialized_data['barcode_image_base64'] = encoded_image  # Attach Base64 encoded image
                response_data.append(serialized_data)

            return Response({"barcodes": response_data}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            # Catch specific errors and return them in the response
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Catch any other unexpected errors
            return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    #Get api for barcode
    def get(self, request, *args, **kwargs):
        try:
            # Retrieve all barcode items from the BarcodeGen model
            barcode_instances = BarcodeGen.objects.all()

            # Serialize the barcode instances
            serializer = BarcodeSerializer(barcode_instances, many=True)

            # Return the serialized data
            return Response({"barcodes": serializer.data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GenerateBarcodeViewTest(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            # Parse JSON data
            data = request.data
            item_name = data.get("item_name")
            item_size = data.get("item_size")
            item_price = data.get("item_price")
            shop_name = data.get("shop_name")
            category_name = data.get("category_name")  # New field
            sub_category = data.get("sub_category")
            quantity = data.get("quantity", 1)  # Default to 1 if not provided
            
            # Validate shop_name length
            if len(shop_name) > 25:
                raise ValueError("shop_name cannot exceed 25 characters.")

            response_data = []
            current_date = datetime.now().strftime("%d")
            sequential_number = 1
            product_details = {
                    "item_name":item_name,
                    "item_size" :item_size,
                    "item_price":item_price,
                    "shop_name":shop_name,
                    "category_name":category_name,
                    "sub_category":sub_category,
                    # "quantity":quantity
                    }
            for _ in range(quantity):
                # Generate a unique serial number based on shop name, item size, and a random number
                # serial_number = f"{shop_name[:2].upper()}{item_size.upper()}{current_date}{sequential_number:04d}"
                prefix = f"{shop_name[:2].upper()}{item_size.upper()}{current_date}"
                prefix1 = f"{shop_name[:2].upper()}{item_size.upper()}"
                # serial_number = f"{prefix}{sequential_number:04d}"
                # existing_images = [image for image in os.listdir("media/barcodes") if image.startswith(prefix1) and image.endswith('png')]
                existing_images_db = [image_path['barcode_image'].split("/")[1] for 
                                        image_path in BarcodeGen.objects.filter(
                                            barcode_image__contains=prefix1).values()]
                # print("existing_images: ",existing_images)
                # print("db: ",existing_images_db)

                existing_sequential_numbers = []
                for image in existing_images_db:
                    # match = re.match(rf'{prefix1}(\d{{4}})\.png', image)
                    match = re.match(rf'{prefix1}\d{{2}}(\d{{4}})\.png', image)
                    if match:
                        existing_sequential_numbers.append(int(match.group(1)))
                if sequential_number in existing_sequential_numbers:
                    sequential_number = max(existing_sequential_numbers)+1
                
                serial_number = f"{prefix}{sequential_number:04d}"
                sequential_number += 1
                product_details["serial_number"] = serial_number
                json_data = json.dumps(product_details)
                dlim_data = f"{serial_number},{item_name},{item_price},{shop_name},\
                                {category_name},{sub_category}"
                # Generate the barcode image
                # barcode = Code128(json_data, writer=ImageWriter())
                # barcode = Code128(dlim_data, writer=ImageWriter())
                barcode = Code128(serial_number, writer=ImageWriter())
                barcode_image = barcode.render(writer_options={
                    # "font_size": 1,
                    # "text_distance": 1,
                    # "module_width": 0.2,  
                    # "module_height": 15,
                    # "quiet_zone":9.5,
                    # "dpi":300,
                    # "write_text": False

                    "font_size": 1,
                    "text_distance": 1,
                    "module_width": 0.2,  
                    "module_height": 5,
                    "write_text": False
                })

                # Create a blank image for adding additional text
                width, height = barcode_image.size
                new_image = Image.new("RGB", (width + 40, height + 100), "white")
                new_image.paste(barcode_image, (20, 80))

                # Add text to the image
                draw = ImageDraw.Draw(new_image)
                try:
                    font = ImageFont.truetype("arial.ttf", 15)
                    font_bold = ImageFont.truetype("arialbd.ttf", 15)
                except IOError:
                    font = ImageFont.load_default()
                    font_bold = font

                # Format category_name for display
                formatted_category = f"{category_name.upper()}_{item_name.upper()}"
                shop_name_width, _ = draw.textbbox((0, 0), shop_name, font=font_bold)[2:]

                draw.text((20, 35), formatted_category, font=font, fill="black")
                draw.text((20, 50), f"Size : {item_size}", font=font, fill="black")
                draw.text((20, 65), f"Price: {item_price}/-", font=font, fill="black")
                draw.text((width - shop_name_width, 10), shop_name.upper(), font=font_bold, fill="black")
                draw.text((width // 2 - 15, height + 70), serial_number.upper(), font=font, fill="black")

                # Save barcode to in-memory file
                buffer = io.BytesIO()
                new_image.save(buffer, "PNG")
                buffer.seek(0)

                # Encode the image to Base64 (Modified line)
                encoded_image = base64.b64encode(buffer.getvalue()).decode('utf-8')  # Added for Base64 encoding

                # Save barcode image and details to the database
                barcode_instance = BarcodeGen(
                    shop_name=shop_name,
                    category_name=category_name,
                    item_name=item_name,
                    item_size=item_size,
                    item_price=item_price,
                    sub_category=sub_category,
                    serial_number=serial_number,
                    barcode_image_base64=encoded_image 
                )
                barcode_instance.barcode_image.save(f"{serial_number}.png", ContentFile(buffer.read()))
                barcode_instance.save()

                # Serialize barcode instance
                serializer = BarcodeSerializer(barcode_instance)

                # Add Base64 encoded image to the response (Modified line)
                serialized_data = serializer.data  # Retrieve serialized data
                serialized_data['barcode_image_base64'] = encoded_image  # Attach Base64 encoded image
                response_data.append(serialized_data)

            return Response({"barcodes": response_data}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            # Catch specific errors and return them in the response
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Catch any other unexpected errors
            return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    #Get api for barcode
    def get(self, request, *args, **kwargs):
        try:
            # Retrieve all barcode items from the BarcodeGen model
            barcode_instances = BarcodeGen.objects.all()

            # Serialize the barcode instances
            serializer = BarcodeSerializer(barcode_instances, many=True)

            # Return the serialized data
            return Response({"barcodes": serializer.data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GetBarcodeDetailsView(APIView):
    permission_classes=[IsAuthenticated]
    renderer_classes=[UserRenderer]
    def get(self, request, barcode, *args, **kwargs):
        # Fetch the item details based on the provided barcode
        try:
            barcode_instance = BarcodeGen.objects.get(serial_number=barcode)

            # Serialize the barcode instance without the image field
            serializer = BarcodeDetailsSerializer(barcode_instance)

            return Response({"item_details": serializer.data}, status=status.HTTP_200_OK)
        except BarcodeGen.DoesNotExist:
            return Response({"error": "Item not found for the given barcode"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "An unexpected error occurred", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class BarcodeFetchView(APIView):
    permission_classes=[IsAuthenticated]
    """
    API endpoint to fetch barcode data by serial number.
    """
    def get(self, request, serial_number):
        try:
            # Fetch the BarcodeGen object using the serial_number
            barcode_data = BarcodeGen.objects.get(serial_number=serial_number)
            serializer = BarcodeSerializer(barcode_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BarcodeGen.DoesNotExist:
            return Response(
                {"error": "Details of Barcode not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
class BarcodeDetailsView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self,request,*args,**kwargs):
        data = request.data
        serial_number = data.get("serial_number")
        try:
            barcode_instance = BarcodeGen.objects.get(
            serial_number=serial_number,
            )

            serializer = BarcodeDetailsSerializer(barcode_instance)
            return Response({"item_details": serializer.data}, status=status.HTTP_200_OK)
        except BarcodeGen.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class BarcodeVerifyView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self,request,*args,**kwargs):
        data = request.data
        serial_number = data.get("serial_number")
        if data.get("reset_status") == "finished":
            BarcodeVerify.objects.all().delete()
            return Response({"message": "All barcode verification statuses have been reset."}, status=status.HTTP_200_OK)
        if data.get("reset_status")=="finished":
            BarcodeVerify.objects.delete()
        if not serial_number:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            barcode_instance = BarcodeGen.objects.get(serial_number=serial_number)
        except BarcodeGen.DoesNotExist:
            return Response({"message": "Barcode not found"}, status=status.HTTP_404_NOT_FOUND)

        if barcode_instance.barcode_scanned:
            return Response({"Message:": "Barcode Already Scanned" }, status=status.HTTP_200_OK)
        with transaction.atomic():
            BarcodeGen.objects.filter(serial_number=serial_number).update(barcode_scanned=True)
            item_name = barcode_instance.item_name
            item_size = barcode_instance.item_size
            category_name = barcode_instance.category_name
            sub_category = barcode_instance.sub_category
            item, created = BarcodeVerify.objects.get_or_create(
                        category_name=category_name,
                        sub_category=sub_category,
                        item_size=item_size,
                        item_name=item_name,
                        defaults={"quantity": 1}
                    )
            if not created:
                item.quantity += 1
                item.save()
            item.barcodes.add(barcode_instance)

        total_stock = BarcodeVerify.objects.values("category_name", "sub_category", 
                                                   "item_size","quantity")
        response_data = {
            "message": "Item count updated successfully!",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "data": {
                "category_name": item.category_name,
                "sub_category": item.sub_category,
                "item_size": item.item_size,
                "item_name": item.item_name,
                "quantity": item.quantity,
                # "scanned_barcodes": list(item.barcodes.values_list("serial_number", flat=True))
            },
            "total_stock": list(total_stock)
        }

        return Response(response_data, status=status.HTTP_200_OK)