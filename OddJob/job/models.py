from django.contrib.auth.models import AbstractUser
from django.db import models

from company.models import *

class JobPost(models.Model):
    title = models.CharField("职位标题", max_length=100)
    company_id = models.ForeignKey('company.Company',verbose_name="公司名称",on_delete=models.CASCADE)
    company_logo = models.CharField("公司图片",max_length=100)  #存放图片地址
    salary = models.CharField("薪资范围", max_length=50)
    location = models.CharField("工作地点", max_length=200)
    description = models.TextField("工作描述")
    urgent = models.BooleanField("紧急",default=False)
    distance = models.CharField("距离", max_length=100)
    work_time = models.CharField("工作时间", max_length=100)
    flash = models.BooleanField("闪电结",default=False)
    work_type = models.CharField("工作类型", max_length=10)
    work_require = models.CharField("工作要求", max_length=100)
    education = models.CharField("学历", max_length=100)