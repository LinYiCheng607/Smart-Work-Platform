from django.urls import path
from .views import RegisterAPIView, LoginAPIView
from rest_framework_simplejwt.views import (
    TokenRefreshView,  #当access token 过期时，客户端可以使用 refresh token 请求一个新的 access token。
)

# access token 是用来访问受保护资源的，但它的生命周期短。
# refresh token 是用来获取新的 access token 的，它的生命周期长。

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('refresh/refresh/', TokenRefreshView.as_view(), name='refresh'),
]