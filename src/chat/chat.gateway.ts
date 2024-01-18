import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {

      const { token, name, email = 'fernando@google.com' } = socket.handshake.auth; 
      console.log({ token, name });
      
      if (!name) {
        socket.disconnect(); 
        return;
      }
      console.log("Cliente conectado",socket.id);
      this.chatService.onClientConnected({ id: socket.id, name: name });
      // console.log('Cliente conectado', socket.id );
      socket.join( email );
      // socket.emit('welcome-message', 'Bienvenido a nuestro chat');

      this.server.emit('on-clients—changed', this.chatService.getClients() );
      
      
      // socket.join("alejandro@gmail.com");

      socket.emit('message', 'Hola cliente');

      socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
        this.chatService.onClientDisconnected( socket.id );
        this.server.emit('on-clients-changed', this.chatService.getClients() )
      })

      socket.on('message', (data) => {
        console.log(data);
        this.server.emit('message', data);
      })
      
    })
  }
}
