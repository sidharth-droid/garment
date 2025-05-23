from rest_framework import serializers
from .models import Order, Item,ItemPreview
from decimal import Decimal

class ItemSerializer(serializers.ModelSerializer):
    total_item_price = serializers.ReadOnlyField()

    class Meta:
        model = Item
        fields = ['id', 'barcode','category','sub_category','size', 'item_name', 'unit', 'unit_price', 'total_item_price']

# class OrderSerializer(serializers.ModelSerializer):
#     items = ItemSerializer(many=True)
#     grand_total = serializers.ReadOnlyField()
#     total_price = serializers.ReadOnlyField()
#     discount = serializers.DecimalField(
#         max_digits=10, decimal_places=2, required=False, allow_null=True
#     )  # Discount is now optional


#     class Meta:
#         model = Order
#         fields = ['id', 'fullname', 'phone_number', 'address', 'tax','tax_type', 'discount', 
#                   'grand_total', 'total_price', 'payment_method1', 'payment_method2', 
#                   'narration', 'payment_method1_amount', 'payment_method2_amount','saletype', 'items']

#     def create(self, validated_data):
#         items_data = validated_data.pop('items', [])  # Extract the items data
#         order = Order.objects.create(**validated_data)  # Create the Order instance

#         # Create Item instances and add them to the order
#         for item_data in items_data:
#             item = Item.objects.create(order=order, **item_data)
#             order.items.add(item)  # Add the item to the order's items

#         # Calculate total price and grand total after items are added
#         order.total_price = order.calculate_total_price()
#         order.grand_total = order.calculate_grand_total()
#         order.save()  # Save the order with updated prices

#         return order

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)

#         # Handle Decimal fields explicitly to make them JSON serializable
#         for field in ['grand_total', 'total_price', 'tax', 'discount']:
#             value = representation.get(field)
#             if isinstance(value, Decimal):
#                 # Convert Decimal to string to avoid JSON serialization error
#                 representation[field] = str(value)  # Or you can use float(value) if you prefer a float

#         return representation

class OrderSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True)
    grand_total = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    discount = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )

    class Meta:
        model = Order
        fields = ['id', 'fullname', 'phone_number', 'address', 'tax', 'tax_type', 'discount', 
                  'grand_total', 'total_price', 'payment_method1', 'payment_method2', 
                  'narration', 'payment_method1_amount', 'payment_method2_amount', 'saletype', 'items']

    def validate_discount(self, value):
        """Ensure empty values are converted to None."""
        if value in ["", None]:  
            return None  # Convert empty string to None
        return Decimal(value)  # Ensure value remains Decimal

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            item = Item.objects.create(order=order, **item_data)
            order.items.add(item)

        order.total_price = order.calculate_total_price()
        order.grand_total = order.calculate_grand_total()
        order.save()

        return order

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Convert Decimal fields to string to prevent serialization errors
        for field in ['grand_total', 'total_price', 'tax', 'discount']:
            value = representation.get(field)
            if isinstance(value, Decimal):
                representation[field] = str(value)

        return representation

#ItemPreview Serializer
class ItemPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPreview
        fields = ['item_name', 'unit', 'unit_price', 'total_item_price']
        read_only_fields = ['total_item_price']

    def validate(self, data):
        # You can add validation for unit and unit_price if needed
        if data['unit'] <= 0 or data['unit_price'] <= 0:
            raise serializers.ValidationError("Unit and unit price must be positive values.")
        return data

    def create(self, validated_data):
        # Calculate the total_item_price before creating the object
        total_item_price = validated_data['unit'] * validated_data['unit_price']
        validated_data['total_item_price'] = total_item_price

        # Create and return the new ItemPreview object
        return ItemPreview.objects.create(**validated_data)