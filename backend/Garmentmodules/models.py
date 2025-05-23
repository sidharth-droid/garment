# from django.db import models

# class Module(models.Model):
#     name = models.CharField(max_length=100)  # Name of the main module (e.g., "Configurations")

#     def __str__(self):
#         return self.name

# class SubModule(models.Model):
#     module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="sub_modules")  # Link to the parent module
#     name = models.CharField(max_length=100)  # Name of the sub-module (e.g., "General Settings")
#     parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="child_modules")  # Link to parent sub-module

#     def __str__(self):
#         return self.name
    
    

from django.db import models

class Module(models.Model):
    name = models.CharField(max_length=100)  

    def __str__(self):
        return self.name

class SubModule(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="sub_modules")  
    name = models.CharField(max_length=100)  
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="child_modules")  

    def __str__(self):
        return self.name
