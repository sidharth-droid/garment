from rest_framework.generics import UpdateAPIView, DestroyAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import RoleBasedUser, Module, SubModule
from .serializers import RoleBasedUserSerializer
from django.shortcuts import get_object_or_404


#To post the user assign modules and sub-modules
class RoleBasedUserCreateView(APIView):
    def post(self, request):
        data = request.data
        role = data.get("role")
        user_name = data.get("user_name")
        is_active = data.get("is_active", True)
        modules_data = data.get("modules", [])

        if not user_name:
            return Response({"success": False, "error": "user_name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if RoleBasedUser.objects.filter(user_name=user_name).exists():
            return Response({"success": False, "error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = RoleBasedUser.objects.create(role=role, user_name=user_name, is_active=is_active)
        module_list = []

        for module_data in modules_data:
            module_name = module_data.get("name")
            module, _ = Module.objects.get_or_create(name=module_name)

            sub_module_list = []
            sub_modules_data = module_data.get("sub_modules", [])

            for sub_module_data in sub_modules_data:
                sub_module_name = sub_module_data.get("name")

                # Ensure unique SubModule
                existing_sub_module = SubModule.objects.filter(name=sub_module_name, module=module).first()
                if not existing_sub_module:
                    sub_module = SubModule.objects.create(name=sub_module_name, module=module)
                else:
                    sub_module = existing_sub_module

                sub_module_list.append({"name": sub_module.name})

            user.modules.add(module)
            module_list.append({"name": module.name, "sub_modules": sub_module_list})

        response_data = {
            "success": True,
            "message": "User created successfully",
            "data": {
                "role": user.role,
                "user_name": user.user_name,
                "is_active": user.is_active,
                "modules": module_list
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

#To view a perticular user assign module and sub-modules

class RoleBasedUserDetailView(APIView):
    """Retrieve a Role-Based User by user_name"""
    def get(self, request, user_name):
        user = get_object_or_404(RoleBasedUser, user_name=user_name)
        serializer = RoleBasedUserSerializer(user)
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)

#To update perticular user assign modules and sub-modules
class RoleBasedUserUpdateView(UpdateAPIView):
    """Update a Role-Based User by user_name"""
    queryset = RoleBasedUser.objects.all()
    serializer_class = RoleBasedUserSerializer
    lookup_field = "user_name"  # Look up by user_name instead of ID

    def update(self, request, *args, **kwargs):
        user = self.get_object()  # Get the existing user
        data = request.data
        modules_data = data.get("modules", [])

        # Update basic user details
        user.role = data.get("role", user.role)
        user.is_active = data.get("is_active", user.is_active)

        module_instances = []

        for module_data in modules_data:
            module_name = module_data.get("name")

            # Get or create the module
            module, _ = Module.objects.get_or_create(name=module_name)

            sub_modules_data = module_data.get("sub_modules", [])
            sub_module_instances = []

            for sub_module_data in sub_modules_data:
                sub_module_name = sub_module_data.get("name")

                # Get or create the sub-module under the module
                sub_module, _ = SubModule.objects.get_or_create(name=sub_module_name, module=module)
                sub_module_instances.append(sub_module)

            module_instances.append(module)

        # Update the user's modules and sub-modules
        user.modules.set(module_instances)
        user.save()

        # Serialize updated user data
        serializer = self.get_serializer(user)
        return Response({"success": True, "message": "User updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)

#To delete perticular user assign modules and sub-modules
class RoleBasedUserDeleteView(APIView):
    """Delete a Role-Based User by user_name"""
    def delete(self, request, user_name):
        user = get_object_or_404(RoleBasedUser, user_name=user_name)
        user.delete()
        return Response({"success": True, "message": "User deleted successfully"}, status=status.HTTP_200_OK)

#TO retrive all the user asign modules and sub-modules details
class RoleBasedUserListView(APIView):
    """Retrieve all Role-Based Users with their assigned modules and sub-modules"""
    def get(self, request):
        users = RoleBasedUser.objects.all()
        serializer = RoleBasedUserSerializer(users, many=True)
        return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)



