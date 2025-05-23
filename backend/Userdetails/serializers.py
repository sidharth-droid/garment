

from rest_framework import serializers
from .models import RoleBasedUser, Module, SubModule

class SubModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubModule
        fields = ['name']

class ModuleSerializer(serializers.ModelSerializer):
    sub_modules = SubModuleSerializer(many=True, required=False)

    class Meta:
        model = Module
        fields = ['name', 'sub_modules']

class RoleBasedUserSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, required=False)

    class Meta:
        model = RoleBasedUser
        fields = ['role', 'user_name', 'modules', 'is_active']

    def create(self, validated_data):
        print("Received data:", validated_data)  # Debugging to check received data

        # Ensure user_name is in the validated data
        user_name = validated_data.get('user_name', None)
        if not user_name:
            raise serializers.ValidationError({"user_name": "This field is required."})

        modules_data = validated_data.pop('modules', [])
        
        # Create RoleBasedUser instance
        role_based_user = RoleBasedUser.objects.create(**validated_data)
        module_instances = []

        for module_data in modules_data:
            sub_modules_data = module_data.pop('sub_modules', [])
            module, _ = Module.objects.get_or_create(name=module_data['name'])

            for sub_module_data in sub_modules_data:
                SubModule.objects.get_or_create(name=sub_module_data['name'], module=module)

            module_instances.append(module)

        role_based_user.modules.set(module_instances)

        return role_based_user





