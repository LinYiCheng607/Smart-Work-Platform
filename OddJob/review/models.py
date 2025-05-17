from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from order.models import *

class ServiceReview(models.Model):
    order = models.OneToOneField(ServiceOrder, verbose_name="关联订单", on_delete=models.CASCADE)
    score = models.SmallIntegerField("服务评分", validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField("评价内容", max_length=500)
    is_anonymous = models.BooleanField("匿名评价", default=False)
