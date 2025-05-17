from django.urls import path
from .views import GetJobAPIView, SearchJobAPIView, PublishJobAPIView

urlpatterns = [
    path('get', GetJobAPIView.as_view(), name='job-get'),
    path('search',SearchJobAPIView.as_view(),name='job-search'),
    path('publish',PublishJobAPIView.as_view(),name='job-publish'),
]