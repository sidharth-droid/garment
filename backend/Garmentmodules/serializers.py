# from rest_framework import serializers
# from .models import Module, SubModule

# class SubModuleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SubModule
#         fields = ['id', 'name']

# class ModuleSerializer(serializers.ModelSerializer):
#     sub_modules = SubModuleSerializer(many=True, required=False)

#     class Meta:
#         model = Module
#         fields = ['id', 'name', 'sub_modules']

#     def create(self, validated_data):
#         sub_modules_data = validated_data.pop('sub_modules', None)
#         module = Module.objects.create(**validated_data)

#         # Check if sub_modules are provided
#         if sub_modules_data:
#             for sub_module_data in sub_modules_data:
#                 SubModule.objects.create(module=module, **sub_module_data)

#         return module


from rest_framework import serializers
from .models import Module, SubModule

class SubModuleSerializer(serializers.ModelSerializer):
    """Handles nested sub-modules"""
    child_modules = serializers.ListField(write_only=True, required=False)  # Accept child modules in input
    children = serializers.SerializerMethodField()  # Return child modules in output

    class Meta:
        model = SubModule
        fields = ['id', 'name', 'child_modules', 'children']

    def get_children(self, obj):
        """Retrieve child sub-modules recursively"""
        children = obj.child_modules.all()  # Fetch children based on parent relation
        return SubModuleSerializer(children, many=True).data  

    def create(self, validated_data):
        """Recursively create sub-modules"""
        child_modules_data = validated_data.pop('child_modules', [])  
        sub_module = SubModule.objects.create(**validated_data)  

        # Create child modules recursively
        for child_data in child_modules_data:
            child_data["module"] = sub_module.module  # Ensure correct module reference
            SubModule.objects.create(parent=sub_module, **child_data)

        return sub_module


class ModuleSerializer(serializers.ModelSerializer):
    """Handles main module and nested sub-modules"""
    sub_modules = serializers.ListField(write_only=True, required=False)  # Accept sub-modules in input
    children = serializers.SerializerMethodField()  # Return sub-modules in output

    class Meta:
        model = Module
        fields = ['id', 'name', 'sub_modules', 'children']

    def get_children(self, obj):
        """Retrieve sub-modules (only top-level ones)"""
        sub_modules = obj.sub_modules.filter(parent=None)  # Get only top-level sub-modules
        return SubModuleSerializer(sub_modules, many=True).data  

    def create(self, validated_data):
        """Recursively create modules and their sub-modules"""
        sub_modules_data = validated_data.pop('sub_modules', [])  
        module = Module.objects.create(**validated_data)  

        def create_submodules(sub_list, parent=None):
            """Recursively create sub-modules"""
            for sub_data in sub_list:
                child_modules = sub_data.pop('child_modules', [])  
                sub_module = SubModule.objects.create(module=module, parent=parent, **sub_data)

                if child_modules:
                    create_submodules(child_modules, sub_module)

        create_submodules(sub_modules_data)
        return module

