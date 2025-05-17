from django.db import models
from user.models import *
from job.models import *
class ServiceOrder(models.Model):
    worker = models.ForeignKey(UserProfile, verbose_name="接单人员", related_name='worker_orders', on_delete=models.PROTECT)
    employer = models.ForeignKey(UserProfile, verbose_name="雇主", related_name='employer_orders', on_delete=models.PROTECT)
    job = models.ForeignKey(JobPost, verbose_name="关联职位", on_delete=models.PROTECT)
    start_time = models.DateTimeField("服务开始时间")
    end_time = models.DateTimeField("服务结束时间")
    payment_status_choices = (
        (0, '待支付'),
        (1, '已支付'),
        (2, '退款中')
    )
    payment_status = models.SmallIntegerField("支付状态", choices=payment_status_choices, default=0)
