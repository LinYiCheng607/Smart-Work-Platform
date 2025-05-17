from django.contrib.auth.models import AbstractUser
from django.db import models

class UserProfile(AbstractUser):
    name = models.CharField("用户名",max_length=120)
    phone = models.CharField("手机号", max_length=20, unique=True)
    password = models.CharField("密码", max_length=100)
    avatar = models.ImageField("头像", upload_to='avatars/', null=True)
    role_choices = (
        (0, '普通用户'),
        (1, '零工人员'),
        (2, '企业管理员'),
        (3, '系统管理员')
    )
    role = models.SmallIntegerField("用户角色", choices=role_choices, default=0)
    id_card = models.CharField("身份证号", max_length=18, unique=True)
    skill_tags = models.CharField("技能标签", max_length=200, blank=True)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='用户组',
        blank=True,
        related_name='userprofile_groups'  # 添加唯一反向名称
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='用户权限',
        blank=True,
        related_name='userprofile_permissions'  # 添加唯一反向名称
    )

class UserJobIntention(models.Model):
    user = models.ForeignKey(UserProfile, verbose_name="关联用户", on_delete=models.CASCADE)
    job_type = models.CharField("期望职位类型", max_length=50)
    expected_salary = models.DecimalField("期望日薪", max_digits=8, decimal_places=2)
    work_area = models.CharField("期望工作区域", max_length=100)