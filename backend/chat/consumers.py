import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import random
from django.contrib.sessions.models import Session
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        

        #Catch the name of the room
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        #Join the room
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        #Accept the connection
        await self.accept()
        for group in self.channel_layer.groups:
            if self.room_group_name == str(group):
                await self.channel_layer.group_send(
                    self.room_group_name,{
                        'type': "users_connected",
                        'users': len(self.channel_layer.groups[group]),
                    }
                )
    async def websocket_disconnect(self, message):
        for group in self.channel_layer.groups:
            if self.room_group_name == str(group):
                await self.channel_layer.group_send(
                    self.room_group_name,{
                        'type': "users_connected",
                        'users': len(self.channel_layer.groups[group])-1,
                    }
                )
        await super().websocket_disconnect(message)
    
    async def receive(self, text_data):
        
        #Receive information from the client and we spread it
        text_data_json = json.loads(text_data)
        name = self.scope["session"].get('name')
        print(self.scope["session"])
        print(name)
        if not name:
            name = text_data_json.get('name', 'Anonymous') + "#" + str(random.randrange(1000, 9999))

            #Conseguir la lista de sesiones y sus nombres para posteriormente comparlos y verificar que no haya ninguno duplicado.
            self.scope['session']['name'] = name

        text = text_data_json.get('text')
        print(self.scope['session']['name'])

        if text and name:
            await self.channel_layer.group_send(
                self.room_group_name,{
                    'type': "chat_message",
                    'name': name,
                    'text': text
                }
            )


    async def users_connected(self, event):
        users = event.get('users')
        channel_disconnected = event.get('channel_disconnected')
        if self.channel_name != channel_disconnected:
            await self.send(
                text_data=json.dumps(
                    {
                        'type': 'users_connected',
                        'users': users
                    }
                )
            )

    async def chat_message(self, event):

        name = event.get('name')
        text = event.get('text')
        await self.send(
            text_data=json.dumps(
                {
                    'type': 'chat_message',
                    'name': name,
                    'text': text
                }
            )
        )