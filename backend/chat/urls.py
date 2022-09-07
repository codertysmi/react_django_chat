from django.urls import path, re_path

from .views import RoomCreateView, RoomListView, RoomUpdateView, RoomDeleteView, SearchView

app_name = 'chat'

urlpatterns = [
    path('', RoomListView.as_view()),
    path('rooms', SearchView.as_view()),
    path('create', RoomCreateView.as_view()),
    path('update', RoomUpdateView.as_view()),
    path('delete', RoomDeleteView.as_view())
]