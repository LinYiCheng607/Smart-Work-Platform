# 配置序列化器 serializer,处理前端传递过来的数据和返回JSON序列化数据

from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username', 'password', 'name', 'phone', 'id_card', 'role']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 6},
            'username': {'required': True, 'min_length': 3, 'max_length': 20},
            'name': {'required': True},
            'phone': {'required': True},
            'id_card': {'required': True},
            'role': {'required': True}
        }

    def validate_phone(self, value):
        if not value.isdigit() or len(value) != 11 or not value.startswith('1'):
            raise serializers.ValidationError('请输入有效的手机号码')
        return value

    def validate_id_card(self, value):
        if not (len(value) == 18 and value[:-1].isdigit() and (value[-1].isdigit() or value[-1].upper() == 'X')):
            raise serializers.ValidationError('请输入有效的身份证号码')
        return value

    def create(self, validated_data):
        #make_password()将明文密码转换为安全的哈希值
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)