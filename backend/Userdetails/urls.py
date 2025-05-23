# from django.urls import path
# from .views import RoleBasedUserCreateView

# urlpatterns = [
#     path('role-based-user/', RoleBasedUserCreateView.as_view(), name='role_based_user_create'),
#     #path('moduledetails/<str:user_name>/', RoleBasedUserDetailView.as_view(), name='role-based-user-detail'),

# ]


from django.urls import path
from .views import (
    RoleBasedUserCreateView,
    RoleBasedUserDetailView,
    RoleBasedUserUpdateView,
    RoleBasedUserDeleteView,
    RoleBasedUserListView
)

urlpatterns = [
    # Create a new role-based user
    path('role-based-user/', RoleBasedUserCreateView.as_view(), name='role_based_user_create'),

    # Retrieve a single user by user_name
    path('role-based-user/<str:user_name>/', RoleBasedUserDetailView.as_view(), name='role_based_user_detail'),

    # Update a user by user_name (partial update)
    path('role-based-user/<str:user_name>/update/', RoleBasedUserUpdateView.as_view(), name='role_based_user_update'),

    # Delete a user by user_name
    path('role-based-user/<str:user_name>/delete/', RoleBasedUserDeleteView.as_view(), name='role_based_user_delete'),

    # Retrieve all users
    path('role-based-user/all',RoleBasedUserListView.as_view(), name='retrive all records')
    
]
