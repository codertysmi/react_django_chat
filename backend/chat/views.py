from typing import List
from django.shortcuts import render

# Create your views here.

from chat.models import Room
from rest_framework.generics import (ListAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, GenericAPIView
)
from rest_framework.mixins import ListModelMixin
from .serializers import RoomSerializer
from rest_framework import permissions, status, filters
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.response import Response

class RoomListView(GenericAPIView):
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
class ListAsQuerySet(list):

    def __init__(self, *args, model, **kwargs):
        self.model = model
        super().__init__(*args, **kwargs)

    def filter(self, *args, **kwargs):
        return self  # filter ignoring, but you can impl custom filter

    def order_by(self, *args, **kwargs):
        return self
class SearchView(ListAPIView):
    queryset = Room.objects.all()
    def get_queryset(self):
        _qqueryset = Room.objects.all()
        channel_layer = get_channel_layer()
        rooms = []
        _names = []
        final_q = []
        for i in _qqueryset:
            _names.append(str(i))
        for room in channel_layer.groups:
            if len(channel_layer.groups[room]) > 0 and str(room[5:]) in _names and str(room[5:]) == self.request.query_params['search']:
                print(str(room[5:]))
                _room = Room.objects.filter(name=str(room[5:])).first()
                _room.users = len(channel_layer.groups[room])
                _room.save()
                final_q.append(_room)
        q=  ListAsQuerySet(final_q, model=Room)
        return q
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
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

class IsOwnerFilterBackend(filters.BaseFilterBackend):
    """
    Filter that only allows users to see their own objects.
    """
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(owner=request.user)