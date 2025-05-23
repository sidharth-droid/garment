# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SalesTarget
from .serializers import SalesTargetSerializer

class SalesTargetRetrieveView(APIView):
    """
    Retrieve the current sales targets.
    """
    def get(self, request):
        target = SalesTarget.objects.first()
        if not target:
            return Response({"error": "Sales targets not set."}, status=status.HTTP_404_NOT_FOUND)
        serializer = SalesTargetSerializer(target)
        return Response(serializer.data)

class SalesTargetCreateView(APIView):
    """
    Create sales targets if they do not exist.
    """
    def post(self, request):
        # Optional: Check if targets already exist
        if SalesTarget.objects.exists():
            return Response({"error": "Sales targets already exist."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SalesTargetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SalesTargetUpdateView(APIView):
    """
    Update existing sales targets, or create them if they don't exist.
    """
    def put(self, request):
        target = SalesTarget.objects.first()
        if target:
            serializer = SalesTargetSerializer(target, data=request.data, partial=True)
        else:
            # Create a new record if it doesn't exist
            serializer = SalesTargetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

