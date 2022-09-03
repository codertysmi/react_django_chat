from django.shortcuts import render

# Create your views here.

from chat.models import Room
from rest_framework.generics import (ListAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, GenericAPIView
)
from rest_framework.mixins import ListModelMixin
from .serializers import RoomSerializer
from rest_framework import permissions, status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.response import Response

class RoomListView(ListModelMixin, GenericAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    def get(self, request, *args, **kwargs):
        channel_layer = get_channel_layer()
        print(channel_layer.groups)
        rooms = []
        for room in channel_layer.groups:
            if len(channel_layer.groups[room]) > 0:
                rooms.append({'name': str(room[5:]).capitalize(), 'users': len(channel_layer.groups[room])})
        
        return Response({"rooms": rooms}, status=status.HTTP_200_OK)
    
        #permission_classes = (permissions.AllowAny)

class RoomCreateView(CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    #permission_classes = (permissions.AllowAny)

class RoomUpdateView(UpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class RoomDeleteView(DestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer