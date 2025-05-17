from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer

class RegisterAPIView(APIView):
    def post(self, request):
        print("Received registration data:", request.data)  # 已有的调试信息
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print("User created successfully:", user.username)  # 添加新的调试信息
            print("User password hash:", user.password)  # 添加密码哈希值调试
            return Response({'code':200,'message':'注册成功'})
        else:
            print("Validation errors:", serializer.errors)  # 已有的调试信息
            return Response({
                'code': 400,
                'message': '注册失败',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        print("Login attempt - Username:", username)  # 添加调试信息
        
        if not username or not password:
            return Response({
                'message': '用户名和密码不能为空'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        print("Authentication result:", user)  # 添加调试信息
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'code': 200,
                'message': '登录成功',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })
        else:
            return Response({
                'message': '用户名或密码错误'
            }, status=status.HTTP_401_UNAUTHORIZED)

