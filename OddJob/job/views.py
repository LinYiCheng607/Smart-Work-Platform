from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import *
from .serializers import JobSerializer
from rest_framework import permissions
class GetJobAPIView(APIView):
    def get(self, request):
        jobs = JobPost.objects.all()
        serializer = JobSerializer(jobs,many=True)
        return Response({'code': 200,'data':serializer.data})

class SearchJobAPIView(APIView):
    def post(self, request):
        jobs = JobPost.objects.filter(question__icontains=request.data['question'])
        serializer = JobSerializer(jobs,many=True)
        return Response({'code': 200,'data':serializer.data})

class PublishJobAPIView(APIView):
    #检验前端token是否正确
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'code': 200,'statu':'发布成功'})
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

