from django.db import models

class Company(models.Model):
    name = models.CharField("企业名称", max_length=100, unique=True)
    license_number = models.CharField("营业执照号", max_length=50)
    contact_phone = models.CharField("联系电话", max_length=20)
    address = models.CharField("注册地址", max_length=200)
    verified = models.BooleanField("认证状态", default=False)
