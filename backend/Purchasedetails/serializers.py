from rest_framework import serializers
from .models import PurchaseEntry

class PurchaseEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseEntry
        fields = '__all__'
        discount_percentage = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
        gst_percentage = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
        read_only_fields = ('reference_voucher_number', 'discount_amount', 'taxable_amount', 'gst_amount', 'purchase_amount')
