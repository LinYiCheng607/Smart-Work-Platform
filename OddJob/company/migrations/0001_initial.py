# Generated by Django 4.2.11 on 2025-05-06 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='企业名称')),
                ('license_number', models.CharField(max_length=50, verbose_name='营业执照号')),
                ('contact_phone', models.CharField(max_length=20, verbose_name='联系电话')),
                ('address', models.CharField(max_length=200, verbose_name='注册地址')),
                ('verified', models.BooleanField(default=False, verbose_name='认证状态')),
            ],
        ),
    ]
