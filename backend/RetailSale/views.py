# from datetime import datetime  # Import this at the top of the file
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import OrderSerializer,ItemPreviewSerializer
# from rest_framework.permissions import IsAuthenticated
# from .renderers import UserRenderer  # Assuming this exists for custom rendering
# from .models import Order,ItemPreview,PreviewGrandTotal,StockDeduction
# from Purchasedetails.models import PurchaseEntry
# from decimal import Decimal
# from django.db.models import F,Sum
# from django.utils import timezone
# from django.db import transaction
# from GarmentShopAPI.models import Item, ItemSize,StockHistory  # Import Item and ItemSize models
# from RetailSale.models import Order
# from django.utils.dateparse import parse_date  # Import parse_date
# from django.db.models.functions import TruncDate
# import json
# from calendar import month_name
# from django.db.models.functions import TruncDate, TruncMonth, TruncYear
# import datetime
# from datetime import date
# from datetime import datetime, timedelta, date







# # To create order

# class CreateOrderView(APIView):
#     permission_classes = [IsAuthenticated]  # Adjust according to your authentication setup

#     def post(self, request):
#         """
#         Create a new order and deduct stock quantities by matching item_name, category, sub_category, and size.
#         This will also store the stock deduction before modifying the stock.
#         """
#         with transaction.atomic():  # Ensure all operations are atomic
#             serializer = OrderSerializer(data=request.data)
#             if serializer.is_valid():
#                 order = serializer.save()  # Save the order

#                 # Deduct stock for each item in the order
#                 for item_data in request.data.get('items', []):
#                     try:
#                         # Fetch the related Item and ItemSize based on provided fields
#                         item = Item.objects.get(
#                             item_name=item_data['item_name'],
#                             category_name=item_data['category'],
#                             sub_category=item_data.get('sub_category', '')  # Handle optional sub_category
#                         )
#                         item_size = item.sizes.get(size=item_data['size'])  # Access related size

#                         # Save the stock deduction before modifying the stock
#                         StockDeduction.objects.create(
#                             item_size=item_size,
#                             change_quantity=item_data['unit'],  # Deduct the quantity based on the order
#                             change_date=timezone.now()  # Record the current date and time
#                         )

#                         # Check if stock is sufficient
#                         if item_size.stock_quantity >= item_data['unit']:
#                             # Deduct the stock from ItemSize
#                             item_size.stock_quantity -= item_data['unit']
#                             item_size.save()
#                         else:
#                             return Response(
#                                 {"error": f"Insufficient stock for {item.item_name} (Size: {item_data['size']})."},
#                                 status=status.HTTP_400_BAD_REQUEST
#                             )
#                     except (Item.DoesNotExist, ItemSize.DoesNotExist):
#                         return Response(
#                             {
#                                 "error": f"Item not found for name {item_data['item_name']}, category {item_data['category']}, "
#                                          f"sub_category {item_data.get('sub_category')} and size {item_data['size']}."
#                             },
#                             status=status.HTTP_400_BAD_REQUEST
#                         )

#                 # Calculate and save totals for the order
#                 order.total_price = order.calculate_total_price()
#                 order.grand_total = order.calculate_grand_total()
#                 order.save()

#                 # Return response with updated data
#                 updated_serializer = OrderSerializer(order)
#                 return Response(
#                     {
#                         "message": "Order created successfully!",
#                         "bill_number": order.bill_number,
#                         "data": updated_serializer.data
#                     },
#                     status=status.HTTP_201_CREATED
#                 )
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from datetime import datetime  
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrderSerializer,ItemPreviewSerializer
from rest_framework.permissions import IsAuthenticated
from .renderers import UserRenderer  # Assuming this exists for custom rendering
from .models import Order,ItemPreview,PreviewGrandTotal,StockDeduction
from decimal import Decimal, InvalidOperation
from django.db.models import F,Sum
from django.utils import timezone
from django.db import transaction
from GarmentShopAPI.models import Item, ItemSize,StockHistory 
from RetailSale.models import Order
from django.utils.dateparse import parse_date  # Import parse_date
from django.db.models.functions import TruncDate
import json
from calendar import month_name
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
import datetime
from datetime import date
from datetime import datetime, timedelta, date
from sms import send_sms
from .utils import send_ultramsg_whatsapp,send_twilio_whatsapp
import cloudinary


# To create order

class CreateOrderView(APIView):
    # permission_classes = [IsAuthenticated]  # Adjust according to your authentication setup

    def post(self, request):
        """
        Create a new order and deduct stock quantities by matching item_name, category, sub_category, and size.
        This will also store the stock deduction before modifying the stock.
        """
        items_list = request.data.get('items',[])
        for item in items_list:
            if item['unit']<=0:
                return Response({"message":"Items unit should be greater than zero."},status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():  # Ensure all operations are atomic
            serializer = OrderSerializer(data=request.data)
            if serializer.is_valid():
                # Deduct stock for each item in the order
                for item_data in request.data.get('items', []):
                    try:
                        # Fetch the related Item and ItemSize based on provided fields
                        item = Item.objects.get(
                            item_name=item_data['item_name'],
                            category_name=item_data['category'],
                            sub_category=item_data.get('sub_category', '')  # Handle optional sub_category
                        )
                        item_size = item.sizes.get(size=item_data['size'])  # Access related size
                        if item_size.stock_quantity < item_data['unit']:
                            return Response(
                            {"error": f"Insufficient stock for {item.item_name} (Size: {item_data['size']})."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    except (Item.DoesNotExist, ItemSize.DoesNotExist):
                        return Response(
                            {
                                "error": f"Item not found for name {item_data['item_name']}, category {item_data['category']}, "
                                         f"sub_category {item_data.get('sub_category')} and size {item_data['size']}."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )
                order = serializer.save()
                
                # Deduct stock for each item in the order
                for item_data in items_list:
                    item = Item.objects.get(
                    item_name=item_data['item_name'],
                    category_name=item_data['category'],
                    sub_category=item_data.get('sub_category', '')  
                    )
                    item_size = item.sizes.get(size=item_data['size'])  

                # Save stock deduction before modifying stock
                    StockDeduction.objects.create(
                        item_size=item_size,
                        change_quantity=item_data['unit'],  
                        change_date=timezone.now()  
                    )

                # Deduct stock from ItemSize
                    item_size.stock_quantity -= item_data['unit']
                    item_size.save()

            # Calculate and save totals for the order
                order.total_price = order.calculate_total_price()
                order.grand_total = order.calculate_grand_total()
                order.save()

                msg_via=request.data['msg_via']

                # Return response with updated data
                updated_serializer = OrderSerializer(order)
                customer_phone_number = order.phone_number

                try:
                    if msg_via=="sms":
                        send_sms(
                            f'Hi {order.fullname}, Thank You For Shopping!\nHere is your invoice https://res.cloudinary.com/dumxbi1vh/raw/upload/v1739784789/tcvdmu1mdwczqxaykum0.pdf',
                            '+18106694970',
                            [f'+91{customer_phone_number}'],
                            fail_silently=False
                            )
                    elif msg_via=="whatsapp":
                        # pdf_file = "test.pdf"
                        # result = cloudinary.uploader.upload(pdf_file, resource_type="raw",public_id=f"invoices/{pdf_file})
                        # print("pdf_url: ",result["secure_url"])
   
                        message = f"Hi {order.fullname},\nThank You For Shopping With Us.\nHere is your invoice."
                        # send_ultramsg_whatsapp(customer_phone_number,message)
                        send_twilio_whatsapp(customer_phone_number,message,order.fullname)
                    else:
                        print("Message Not Sent To The Customer.")
                except Exception as e:
                    return Response(
                        {
                            "message": "Order created successfully, but Message sending failed.",
                            "error": str(e),
                            "bill_number": order.bill_number,
                            "data": updated_serializer.data
                        },
                        status=status.HTTP_201_CREATED
                        )
                return Response(
                    {
                        "message": "Order created successfully!",
                        "bill_number": order.bill_number,
                        "data": updated_serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#To get all order details
class GetOrderDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Retrieve all orders with detailed information.
        """
        orders = Order.objects.all()
        order_list = []
        for order in orders:
            order_data = {
                "id": order.id,
                "bill_number": order.bill_number,
                "fullname": order.fullname,
                "phone_number": order.phone_number,
                "address": order.address,
                "tax": str(order.tax) if isinstance(order.tax, Decimal) else order.tax,
                "discount": str(order.discount) if isinstance(order.discount, Decimal) else order.discount,
                "grand_total": str(order.grand_total) if isinstance(order.grand_total, Decimal) else order.grand_total,
                "total_price": str(order.total_price) if isinstance(order.total_price, Decimal) else order.total_price,
                "payment_method1": order.payment_method1,
                "payment_method2": order.payment_method2,
                "narration": order.narration,
                "payment_method1_amount": str(order.payment_method1_amount) if isinstance(order.payment_method1_amount, Decimal) else order.payment_method1_amount,
                "payment_method2_amount": str(order.payment_method2_amount) if isinstance(order.payment_method2_amount, Decimal) else order.payment_method2_amount,
                "saletype":order.saletype,
                "items": [
                    {
                        "barcode": item.barcode,
                        "category":item.category,
                        "sub_category":item.sub_category,
                        "size":item.size,
                        "item_name": item.item_name,
                        "unit": item.unit,
                        "unit_price": str(item.unit_price) if isinstance(item.unit_price, Decimal) else item.unit_price,
                        "total_item_price": str(item.total_item_price) if isinstance(item.total_item_price, Decimal) else item.total_item_price
                    } for item in order.items.all()
                ]
            }
            order_list.append(order_data)
        
        return Response(order_list, status=status.HTTP_200_OK)

#To calculate total pricing by taking grandtotal,discount and tax
class CalculateTotalPriceView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def post(self, request):
        """
        Calculate the total price based on grand_total, discount, and tax.
        """
        try:
            grand_total = Decimal(request.data.get('grand_total', 0))  # Default to 0 if not present
            discount = Decimal(request.data.get('discount', 0))        # Default to 0 if not present
            tax = Decimal(request.data.get('tax', 0))                  # Default to 0 if not present
        except (TypeError, ValueError,InvalidOperation):
            return Response({"error": "Invalid input. Please provide valid numbers for grand_total, discount, and tax."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate total_price
        total_price = grand_total + tax - discount

        # Return the calculated total_price
        return Response({"total_price": str(total_price)}, status=status.HTTP_200_OK)

#Calculate paymentmethod2 by taking totalprice and paymentmethod1
# class CalculatePaymentMethod2AmountView(APIView):
#     permission_classes = [IsAuthenticated]
#     renderer_classes=[UserRenderer]

#     def post(self,request):
#         """
#         Calculate the amount for payment method2

#         """
#         try:
#             total_price=Decimal(request.data.get('total_price'))
#             payment_method1_amount=Decimal(request.data.get('payment_method1_amount'))
#         except (TypeError, ValueError, Decimal.InvalidOperation):
#             return Response({"error": "Invalid input. Please provide valid numbers for total_price and payment_method1_amount."}, status=status.HTTP_400_BAD_REQUEST)
        
#         #calculation of payment_method2_amount
#         payment_method2_amount=total_price-payment_method1_amount

#         #return response of calulated amount of payment_method1
#         return Response({"payment_method2_amount": str(payment_method2_amount)}, status=status.HTTP_200_OK)

class CalculatePaymentMethod2AmountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Calculate the amount for payment method2
        If payment_method1_amount is not provided, return total_price as payment_method2_amount.
        """
        try:
            total_price = Decimal(request.data.get('total_price', '0'))
            payment_method1_amount = request.data.get('payment_method1_amount')

            if payment_method1_amount is not None:
                payment_method1_amount = Decimal(payment_method1_amount)
                payment_method2_amount = total_price - payment_method1_amount
            else:
                # If payment_method1_amount is not provided, return total_price
                payment_method2_amount = total_price

            return Response({"payment_method2_amount": str(payment_method2_amount)}, status=status.HTTP_200_OK)

        except (TypeError, ValueError, InvalidOperation):
            return Response(
                {"error": "Invalid input. Please provide valid numbers for total_price and payment_method1_amount."},
                status=status.HTTP_400_BAD_REQUEST
            )

#Retrive order details by passing bill number
class RetrieveOrderByBillNumberView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [UserRenderer]

    def get(self, request, bill_number):
        """
        Retrieve order details by bill_number.
        """
        try:
            order = Order.objects.get(bill_number=bill_number)
        except Order.DoesNotExist:
            return Response({"error": "Order not found for the provided bill number."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize order details
        order_data = {
            "id": order.id,
            "fullname": order.fullname,
            "phone_number": order.phone_number,
            "address": order.address,
            "tax": str(order.tax) if isinstance(order.tax, Decimal) else order.tax,
            "discount": str(order.discount) if isinstance(order.discount, Decimal) else order.discount,
            "grand_total": str(order.grand_total) if isinstance(order.grand_total, Decimal) else order.grand_total,
            "total_price": str(order.total_price) if isinstance(order.total_price, Decimal) else order.total_price,
            "payment_method1": order.payment_method1,
            "payment_method2": order.payment_method2,
            "narration": order.narration,
            "payment_method1_amount": str(order.payment_method1_amount) if isinstance(order.payment_method1_amount, Decimal) else order.payment_method1_amount,
            "payment_method2_amount": str(order.payment_method2_amount) if isinstance(order.payment_method2_amount, Decimal) else order.payment_method2_amount,
            "saletype":order.saletype,
            "items": [
                {
                    "barcode": item.barcode,
                    "category":item.category,
                    "sub_category":item.sub_category,
                    "item_name": item.item_name,
                    "unit": item.unit,
                    "size": item.size,
                    "unit_price": str(item.unit_price) if isinstance(item.unit_price, Decimal) else item.unit_price,
                    "total_item_price": str(item.total_item_price) if isinstance(item.total_item_price, Decimal) else item.total_item_price
                } for item in order.items.all()
            ]
        }

        return Response(order_data, status=status.HTTP_200_OK)
         # Queryset to generate the report
#Retrieve date-wise sales report with sale type, category, total amount, and total units.
class SalesReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Retrieve date-wise sales report with sale type, category, total amount, and total units.
        """
        # Aggregate data based on Orders
        report_data = (
            Order.objects
            .filter(items__isnull=False)  # Ensure that the order has related items
            .values(
                date=TruncDate('created_at'),  # Group by date of the order
                sale_type=F('saletype'),       # Group by sale type from Order (use an alias name)
                category=F('items__category'), # Group by category from related Item
            )
            .annotate(
                total_amount=Sum(F('items__unit') * F('items__unit_price')),  # Calculate total amount based on related Item fields
                total_unit=Sum('items__unit')  # Calculate total units based on related Item quantity
            )
            .order_by('date', 'sale_type','category')  # Order results by date and sale_type
        )

        # Prepare the response data
        report_list = []
        for entry in report_data:
            report_list.append({
                "date": entry['date'],
                "sale_type": entry['sale_type'],  # Sale type (RetailSale or BulkSale)
                "category":entry['category'],
                "total_amount": str(entry['total_amount']) if isinstance(entry['total_amount'], Decimal) else entry['total_amount'],
                "total_unit": entry['total_unit']  # Total units sold
            })

        return Response(report_list, status=status.HTTP_200_OK)

    def post(self, request):
        permission_classes = [IsAuthenticated]
        """
        Retrieve filtered date-wise sales report with sale type, category, total amount, and total units.
        Additionally, return the total sum of all amounts for the specified date range.
        """
        # Extract filter parameters from the request body
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        sale_type = request.data.get('sale_type')

        # Validate date input
        if start_date:
            start_date = parse_date(start_date)
            if not start_date:
                return Response({"error": "Invalid start_date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        
        if end_date:
            end_date = parse_date(end_date)
            if not end_date:
                return Response({"error": "Invalid end_date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Build the query filters dynamically
        filters = {}
        if start_date:
            filters['created_at__date__gte'] = start_date
        if end_date:
            filters['created_at__date__lte'] = end_date
        if sale_type:
            filters['saletype'] = sale_type

        # Aggregate data based on Orders
        report_data = (
            Order.objects
            .filter(items__isnull=False, **filters)  # Apply dynamic filters
            .values(
                date=TruncDate('created_at'),  # Group by date of the order
                sale_type=F('saletype'),       # Group by sale type from Order
                category=F('items__category'), # Group by category from related Item
            )
            .annotate(
                total_amount=Sum(F('items__unit') * F('items__unit_price')),  # Calculate total amount
                total_unit=Sum('items__unit')  # Calculate total units
            )
            .order_by('date', 'sale_type', 'category')  # Order results
        )

        # Calculate the total sum of all amounts in the filtered dataset
        total_sum = report_data.aggregate(total_sum=Sum('total_amount'))['total_sum']

        # Prepare the response data
        report_list = [
            {
                "date": entry['date'],
                "sale_type": entry['sale_type'],
                "category": entry['category'],
                "total_amount": str(entry['total_amount']) if isinstance(entry['total_amount'], Decimal) else entry['total_amount'],
                "total_unit": entry['total_unit']
            }
            for entry in report_data
        ]

        # Return the response, including the summary
        return Response({
            "message": "Filtered sales report retrieved successfully.",
            "report": report_list,
            "total_sum": str(total_sum) if isinstance(total_sum, Decimal) else total_sum
        }, status=status.HTTP_200_OK)

class CustomerSummaryView(APIView):
    
 def post(self, request):
    """
    Accept saletype (optional) and retrieve sales summary grouped by phone number.
    If no saletype is provided, retrieve sales data for all types.
    """
    saletype = request.data.get("saletype", None)
    
    # Fetch all orders with or without the saletype filter
    if saletype:
        orders = Order.objects.filter(saletype=saletype, items__isnull=False).prefetch_related('items')
    else:
        orders = Order.objects.filter(items__isnull=False).prefetch_related('items')

    if not orders.exists():
        return Response({"error": "No orders found."}, status=status.HTTP_404_NOT_FOUND)

    # Group data by phone_number
    phone_number_data = {}
    for order in orders:
        phone_number = order.phone_number
        fullname = order.fullname
        if phone_number not in phone_number_data:
            phone_number_data[phone_number] = {
                "fullname": fullname,
                "saletype": order.saletype,  # Save the sale type for each entry
                "phone_number": phone_number,
                "total_amount": Decimal('0.00'),
                "total_quantity": 0,
            }

        # Add total_price from the order
        phone_number_data[phone_number]["total_amount"] += order.total_price

        # Add total quantity of items in the order
        for item in order.items.all():
            phone_number_data[phone_number]["total_quantity"] += item.unit

    # Prepare the response data
    response_data = []
    for data in phone_number_data.values():
        total_amount = data["total_amount"]
        total_quantity = data["total_quantity"]

        # Calculate average amount per unit
        average_amount = total_amount / total_quantity if total_quantity > 0 else Decimal('0.00')
        data["total_amount"] = str(total_amount)
        data["average_amount"] = str(average_amount)

        response_data.append(data)

    return Response(response_data, status=status.HTTP_200_OK)


    
    def get(self, request):
        """
        Retrieve sales summary for all users, including total amount, total quantity, and average amount.
        """
        # Retrieve all orders with related items (prefetch to avoid multiple queries)
        orders = (
            Order.objects
            .filter(items__isnull=False)  # Ensure that the order has related items
            .prefetch_related('items')    # Prefetch related items to optimize queries
        )

        user_sales_data = {}

        # Loop through orders and aggregate sales data by customer
        for order in orders:
            fullname = order.fullname  # Adjust field name as needed
            phone_number = order.phone_number  # Adjust field name as needed

            if fullname not in user_sales_data:
                user_sales_data[fullname] = {
                    "total_amount": Decimal('0.00'),
                    "total_quantity": 0
                }
            

            # Add total_price from Order model
            user_sales_data[fullname]["total_amount"] += order.total_price

            # Add quantity from related items
            for item in order.items.all():
                user_sales_data[fullname]["total_quantity"] += item.unit

        # Prepare the response data with calculated averages
        response_data = []
        for fullname, data in user_sales_data.items():
            total_amount = data["total_amount"]
            total_quantity = data["total_quantity"]

            # Calculate average amount per unit (if there are any units sold)
            average_amount = total_amount / total_quantity if total_quantity > 0 else Decimal('0.00')

            response_data.append({
                "fullname": fullname,
                "phone_number":phone_number,
                "total_amount": str(total_amount),  # Ensure the total amount is converted to string
                "total_quantity": total_quantity,
                "average_amount": str(average_amount)  # Average amount per unit
            })

        return Response(response_data, status=status.HTTP_200_OK)


#Get API for dashboard section

class DailySalesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Retrieve daily sales report including date, sale type, total amount, and total units.
        """
        # Get the current date
        current_date = date.today()

        # Query to calculate daily sales data
        daily_sales = (
            Order.objects
            .filter(items__isnull=False)  # Ensure that the order has related items
            .values(
                date=TruncDate('created_at'),  # Group by date
                sale_type=F('saletype')        # Annotate sale_type
            )
            .annotate(
                total_amount=Sum(F('items__unit') * F('items__unit_price')),  # Calculate total amount
                total_unit=Sum('items__unit')  # Calculate total units
            )
            .order_by('date', 'sale_type')  # Order results
        )

        # Aggregate current date sales
        current_day_sales = []
        for entry in daily_sales:
            if entry['date'] == current_date:
                current_day_sales.append({
                    "date": current_date.strftime('%Y-%m-%d'),
                    "total_amount": str(entry['total_amount']),
                    "total_units": entry['total_unit']
                })

        # Sum up total amounts for current date sales
        total_current_day_amount = sum(Decimal(e['total_amount']) for e in current_day_sales) if current_day_sales else Decimal('0')
        total_current_day_units = sum(e['total_units'] for e in current_day_sales) if current_day_sales else 0

        # Construct the response data
        response_data = {
            "message": "Daily sales report retrieved successfully.",
            "title":"Daily Sales Report",
            "current_date": current_date.strftime('%Y-%m-%d'),
            "current_day_sales": [
                {
                    "date": current_date.strftime('%Y-%m-%d'),
                    "total_amount": str(total_current_day_amount),
                    "total_units": total_current_day_units
                }
            ],
            "all_sales": [
                {
                    "date": entry['date'].strftime('%Y-%m-%d'),
                    "sale_type": entry['sale_type'],
                    "total_amount": str(entry['total_amount']),
                    "total_units": entry['total_unit']
                }
                for entry in daily_sales
            ]
        }

        return Response(response_data, status=status.HTTP_200_OK)
class MonthlySalesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Retrieve monthly sales report including month and year, sale type, total amount, and total units.
        """
        # Get the current month and year
        current_year = date.today().year
        current_month = date.today().strftime('%B')

        # Query to calculate monthly sales data
        monthly_sales = (
            Order.objects
            .filter(items__isnull=False)  # Ensure that the order has related items
            .values(
                month=TruncMonth('created_at'),  # Group by month
                year=TruncYear('created_at'),  # Group by year
                sale_type=F('saletype')         # Annotate sale_type
            )
            .annotate(
                total_amount=Sum(F('items__unit') * F('items__unit_price')),  # Calculate total amount
                total_unit=Sum('items__unit')  # Calculate total units
            )
            .order_by('year', 'month', 'sale_type')  # Order results
        )

        # Aggregate current month sales
        current_month_sales = []
        for entry in monthly_sales:
            if entry['month'].strftime('%B') == current_month and entry['year'].year == current_year:
                current_month_sales.append({
                    "month": entry['month'].strftime('%B %Y'),
                    "year": entry['year'].year,
                    "total_amount": str(entry['total_amount']),
                    "total_units": entry['total_unit']
                })

        # Sum up total amounts for current month sales
        total_current_month_amount = sum(Decimal(e['total_amount']) for e in current_month_sales) if current_month_sales else Decimal('0')
        total_current_month_units = sum(e['total_units'] for e in current_month_sales) if current_month_sales else 0

        # Construct the response data
        response_data = {
            "message": "Monthly sales report retrieved successfully.",
            "title":"Monthly Sales Report",
            "current_month": f"{current_month} {current_year}",
            "current_month_sales": [
                {
                    "month": f"{current_month} {current_year}",
                    "total_amount": str(total_current_month_amount),
                    "total_units": total_current_month_units
                }
            ],
            "all_sales": [
                {
                    "month": entry['month'].strftime('%B %Y'),
                    "year": entry['year'].year,
                    "sale_type": entry['sale_type'],
                    "total_amount": str(entry['total_amount']),
                    "total_units": entry['total_unit']
                }
                for entry in monthly_sales
            ]
        }

        return Response(response_data, status=status.HTTP_200_OK)

class YearlySalesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Retrieve yearly sales report including year, total amount, and total units.
        """
        # Get the current year
        current_year = date.today().year

        # Query to calculate yearly sales data
        yearly_sales = (
            Order.objects
            .filter(items__isnull=False)  # Ensure that the order has related items
            .values(
                year=TruncYear('created_at'),  # Group by year
                sale_type=F('saletype'),       # Annotate sale_type
                category=F('items__category'),  # Annotate category
            )
            .annotate(
                total_amount=Sum(F('items__unit') * F('items__unit_price')),  # Calculate total amount
                total_unit=Sum('items__unit')  # Calculate total units
            )
            .order_by('year', 'sale_type', 'category')  # Order results
        )

        # Aggregate current year sales
        current_year_sales = []
        for entry in yearly_sales:
            if entry['year'].year == current_year:
                current_year_sales.append({
                    "year": current_year,
                    "total_amount": str(entry['total_amount']),
                    "total_units": entry['total_unit']
                })

        # Sum up total amounts for current year sales
        total_current_year_amount = sum(Decimal(e['total_amount']) for e in current_year_sales) if current_year_sales else Decimal('0')
        total_current_year_units = sum(e['total_units'] for e in current_year_sales) if current_year_sales else 0

        # Construct the response data
        response_data = {
            "message": "Yearly sales report retrieved successfully.",
            "title":"Yearly Sales Report",
            "current_year": current_year,
            "current_year_sales": [
                {
                    "year": current_year,
                    "total_amount": str(total_current_year_amount),
                    "total_units": total_current_year_units
                }
            ],
            "all_sales": [
                {
                    "year": entry['year'].year,
                    "sale_type": entry['sale_type'],
                    "category": entry['category'],
                    "total_amount": str(entry['total_amount']),
                    "total_units": entry['total_unit']
                }
                for entry in yearly_sales
            ]
        }

        return Response(response_data, status=status.HTTP_200_OK)

#Retrive customer details by passing phonenumber in body
# class GetCustomerDetailsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         """
#         Retrieve the fullname and address of a customer by phone number.
#         """
#         phone_number = request.data.get("phone_number")

#         if not phone_number:
#             return Response(
#                 {"error": "Phone number is required."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # Assuming phone_number is unique in the Order model
#             order = Order.objects.get(phone_number=phone_number)
#             customer_data = {
#                 "fullname": order.fullname,
#                 "address": order.address,
#             }
#             return Response(customer_data, status=status.HTTP_200_OK)
#         except Order.DoesNotExist:
#             return Response(
#                 {"error": "No customer found with the provided phone number."},
#                 status=status.HTTP_404_NOT_FOUND
#             )

class GetCustomerDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Retrieve the fullname and address of a customer by phone number.
        """
        phone_number = request.data.get("phone_number")

        if not phone_number:
            return Response(
                {"error": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the first order with this phone number
        order = Order.objects.filter(phone_number=phone_number).first()

        if not order:
            return Response(
                {"error": "No customer found with the provided phone number."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Return customer's name and address (assuming it's the same for all orders)
        customer_data = {
            "fullname": order.fullname,
            "address": order.address,
        }

        return Response(customer_data, status=status.HTTP_200_OK)

class ItemPreviewAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        # Extract 'items' from the request data
        items = request.data.get('items', [])
        if not isinstance(items, list):
            return Response({"error": "Invalid data format. 'items' should be a list."}, status=status.HTTP_400_BAD_REQUEST)

        created_items = []  # Stores successfully created items
        errors = []  # Stores validation errors
        grand_total = 0  # Initialize grand total for the current request

        for item_data in items:
            serializer = ItemPreviewSerializer(data=item_data)
            if serializer.is_valid():
                # Save each valid item
                created_item = serializer.save()
                created_items.append(serializer.data)
                # Add item's total_item_price to the grand total
                grand_total += created_item.total_item_price
            else:
                errors.append(serializer.errors)

        # Store the grand total in the database as a new record
        PreviewGrandTotal.objects.create(grand_total=grand_total)

        # Prepare the response
        response_data = {
            "message": "Items processed successfully.",
            "created_items": created_items,
            "errors": errors,
            "grand_total": grand_total  # Total for this request
        }

        # Return response with status code
        return Response(
            response_data,
            status=status.HTTP_201_CREATED if created_items else status.HTTP_400_BAD_REQUEST
        )

#StockHistory Report


# class ItemStockSummaryView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Get the date parameter if provided, otherwise include all dates
#         requested_date = request.query_params.get('date')
        
#         if requested_date:
#             try:
#                 date_filter = date.fromisoformat(requested_date)  # Parse the date string
#             except ValueError:
#                 return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
#         else:
#             date_filter = None  # No date filtering if not provided

#         # Fetch data
#         item_data = []
#         items = Item.objects.all()

#         for item in items:
#             sizes = item.sizes.all()
#             for size in sizes:
#                 # Group totals by date for StockHistory
#                 stock_history_totals = StockHistory.objects.filter(
#                     item_size=size,
#                     **({"change_date__date": date_filter} if date_filter else {})
#                 ).values('change_date__date').annotate(total_added=Sum('change_quantity'))

#                 # Group totals by date for StockDeduction
#                 stock_deduction_totals = StockDeduction.objects.filter(
#                     item_size=size,
#                     **({"change_date__date": date_filter} if date_filter else {})
#                 ).values('change_date__date').annotate(total_deducted=Sum('change_quantity'))

#                 # Combine the dates and calculate totals
#                 date_totals = {}
#                 for entry in stock_history_totals:
#                     date_key = entry['change_date__date']
#                     if date_key not in date_totals:
#                         date_totals[date_key] = {'total_quantity_added': 0, 'total_deducted_quantity': 0}
#                     date_totals[date_key]['total_quantity_added'] += entry['total_added']

#                 for entry in stock_deduction_totals:
#                     date_key = entry['change_date__date']
#                     if date_key not in date_totals:
#                         date_totals[date_key] = {'total_quantity_added': 0, 'total_deducted_quantity': 0}
#                     date_totals[date_key]['total_deducted_quantity'] += entry['total_deducted']

#                 # Format date-wise totals for the response
#                 date_summary = [
#                     {
#                         "date": date_key,
#                         "total_quantity_added": totals['total_quantity_added'],
#                         "total_deducted_quantity": totals['total_deducted_quantity']
#                     }
#                     for date_key, totals in sorted(date_totals.items())
#                 ]

#                 # Add item size-specific data to the response
#                 item_data.append({
#                     "item_name": item.item_name,
#                     "item_code": item.item_code,
#                     "category": item.category_item,
#                     "sub_category": item.sub_category,
#                     "size": size.size,
#                     "stock_quantity": size.stock_quantity,
#                     "date_summary": date_summary,  # Date-wise summary of totals
#                 })

#         return Response({"data": item_data}, status=200)


#Stock report with original stock_quantity,stockin,stockout and current stock
class ItemStockSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the date parameter if provided, otherwise include all dates
        requested_date = request.query_params.get('date')

        if requested_date:
            try:
                date_filter = date.fromisoformat(requested_date)  # Parse the date string
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
        else:
            date_filter = None  # No date filtering if not provided

        # Fetch data
        item_data = []
        items = Item.objects.all()

        for item in items:
            sizes = item.sizes.all()
            for size in sizes:
                # Fetch stock history grouped by date
                stock_history_by_date = StockHistory.objects.filter(
                    item_size=size,
                    **({"change_date__date": date_filter} if date_filter else {})
                ).values('change_date__date').annotate(
                    total_added=Sum('change_quantity')
                )

                # Fetch stock deduction grouped by date
                stock_deduction_by_date = StockDeduction.objects.filter(
                    item_size=size,
                    **({"change_date__date": date_filter} if date_filter else {})
                ).values('change_date__date').annotate(
                    total_deducted=Sum('change_quantity')
                )

                # Combine the results by date
                date_map = {}
                for entry in stock_history_by_date:
                    date_map[entry['change_date__date']] = {
                        "total_quantity_added": entry['total_added'],
                        "total_deducted_quantity": 0
                    }
                for entry in stock_deduction_by_date:
                    if entry['change_date__date'] in date_map:
                        date_map[entry['change_date__date']]["total_deducted_quantity"] = entry['total_deducted']
                    else:
                        date_map[entry['change_date__date']] = {
                            "total_quantity_added": 0,
                            "total_deducted_quantity": entry['total_deducted']
                        }

                # Add data for each date
                for change_date, totals in date_map.items():
                    item_data.append({
                        "date": change_date,
                        "item_name": item.item_name,
                        "item_code": item.item_code,
                        "category": item.category_name,
                        "sub_category": item.sub_category,
                        "size": size.size,
                        "current_stock_quantity": size.stock_quantity,
                        "original_stock_quantity": size.stock_quantity - totals["total_quantity_added"] + totals["total_deducted_quantity"],
                        "total_quantity_added": totals["total_quantity_added"],
                        "total_deducted_quantity": totals["total_deducted_quantity"],
                    })

        return Response({"data": item_data}, status=200)




class SalesTaxView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Fetch sales summary optionally filtered by date range and tax type.
        """
        # Extract date range and tax_type from the request
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        tax_type = request.data.get('tax_type')

        # Parse start_date and end_date if provided
        try:
            if start_date:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            if end_date:
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter orders based on provided criteria
        filters = {}
        if start_date:
            filters["created_at__date__gte"] = start_date
        if end_date:
            filters["created_at__date__lte"] = end_date
        if tax_type:
            filters["tax_type"] = tax_type

        # Retrieve and aggregate data
        orders = Order.objects.filter(**filters)
        summary = (
            orders.annotate(
                category_name=F('items__category')  # Fetch `category` from the related `Item`
            )
            .values('created_at__date', 'category_name', 'saletype')
            .annotate(
                total_price_sum=Sum('total_price'),
                tax_sum=Sum('tax')
            )
            .order_by('created_at__date', 'category_name', 'saletype')
        )

        # Format the response
        data = [
            {
                "date": entry['created_at__date'],
                "category": entry['category_name'],
                "sale_type": entry['saletype'],
                "total_price": entry['total_price_sum'],
                "total_tax": entry['tax_sum']
            }
            for entry in summary
        ]

        return Response({"data": data}, status=status.HTTP_200_OK)

#Discount report
# class SaleDiscountSummaryView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self, request):
#         """
#         Retrieve sales discount summary based on a date range and sale type, 
#         including customer details.
#         """
#         # Get date range and saletype from the request
#         start_date = request.data.get('start_date',None)
#         end_date = request.data.get('end_date',None)
#         saletype = request.data.get('saletype',None)

#         if not start_date or not end_date or not saletype:
#             return Response({"error": "Start date, end date, and saletype are required."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             # Convert string dates to datetime objects
#             start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
#             end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
#         except ValueError:
#             return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

#         # Filter orders by the provided date range and sale type
#         orders = Order.objects.filter(
#             created_at__date__range=[start_date, end_date],
#             saletype=saletype
#         )

#         sales_summary = []

#         # Group data by date and calculate totals
#         for date in orders.values('created_at__date').distinct():
#             date_orders = orders.filter(created_at__date=date['created_at__date'])
            
#             total_discount = date_orders.aggregate(Sum('discount'))['discount__sum'] or 0

#             # Collect customer details for the date
#             customer_details = date_orders.values('fullname', 'phone_number', 'address').distinct()

#             sales_summary.append({
#                 "date": date['created_at__date'],
#                 "saletype": saletype,
#                 "total_discount": total_discount,
#                 "customer_details": list(customer_details)
#             })

#         return Response({"sales_summary": sales_summary}, status=status.HTTP_200_OK)



class SaleDiscountSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Retrieve sales discount summary based on a date range and sale type, 
        including customer details.
        """
        # Get date range and saletype from the request (optional)
        start_date = request.data.get('start_date', None)
        end_date = request.data.get('end_date', None)
        saletype = request.data.get('saletype', None)

        # Initialize filters for the query
        filters = {}

        # Handle optional date filters
        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
                end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
                filters['created_at__date__range'] = [start_date, end_date]
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # Handle optional sale type filter
        if saletype:
            filters['saletype'] = saletype

        # Fetch orders based on filters (no filters fetch all orders)
        orders = Order.objects.filter(**filters)

        sales_summary = []

        # Group data by date and calculate totals
        for date in orders.values('created_at__date').distinct():
            date_orders = orders.filter(created_at__date=date['created_at__date'])
            
            total_discount = date_orders.aggregate(Sum('discount'))['discount__sum'] or 0

            # Collect customer details for the date
            customer_details = date_orders.values('fullname', 'phone_number', 'address').distinct()

            sales_summary.append({
                "date": date['created_at__date'],
                "saletype": saletype if saletype else "All Sale Types",  # Show all sale types if saletype is not provided
                "total_discount": total_discount,
                "customer_details": list(customer_details)
            })

        return Response({"sales_summary": sales_summary}, status=status.HTTP_200_OK)

class ProfitMarginReportView(APIView):
    def get(self, request):
        report = []
        total_profit = Decimal(0)
        total_revenue = Decimal(0)
        total_cost = Decimal(0)

        # Fetch all sold items, using the correct model and field names
        sold_items = Item.objects.values('item_name', 'category').annotate(
            total_sold=Sum('unit'),  # Ensure correct use of 'unit' field
            selling_price=F('unit_price')
        )

        for item in sold_items:
            item_name = item['item_name']
            total_sold = item['total_sold']
            selling_price = item['selling_price']
            category = item['category'] if item['category'] else "Uncategorized"  # Correct field reference

            # Fetch purchase entry for the item
            purchase_entry = PurchaseEntry.objects.filter(item=item_name).first()
            if not purchase_entry:
                continue  # Skip if no purchase entry found

            # Calculate cost price per unit from PurchaseEntry
            cost_price_per_unit = purchase_entry.purchase_amount / purchase_entry.quantity
            profit_per_unit = selling_price - cost_price_per_unit
            total_profit_for_item = profit_per_unit * total_sold
            profit_margin = (profit_per_unit / cost_price_per_unit) * 100 if cost_price_per_unit > 0 else 0

            total_profit += total_profit_for_item
            total_revenue += selling_price * total_sold
            total_cost += cost_price_per_unit * total_sold

            report.append({
                "Item Name": item_name,
                "Total Quantity Sold": total_sold,
                "Total Sales Amount": round(selling_price * total_sold, 2),
                "Item Category": category,
                "Profit Margin": round(profit_margin, 2)
            })

        # Return the aggregated result
        return Response({
            "report": report,
            "total_profit": round(total_profit, 2),
            "total_revenue": round(total_revenue, 2),
            "total_cost": round(total_cost, 2),
            "overall_profit_margin": round((total_profit / total_cost) * 100 if total_cost > 0 else 0, 2),
        }, status=status.HTTP_200_OK)