import { Injectable } from '@nestjs/common';


interface Client {
    id: string;
    name: string;
}

@Injectable()
export class ChatService {

    private clients: Record<string, Client> = {};


    onClientConnected(client: Client) {
        console.log("onClientConnected:",client)
        this.clients[client.id] = client;
    }

    onClientDisconnected(id: string) {
        console.log("onClientDisconnected:",id)
        delete this.clients[id];
    }

    getClients() {
        console.log("getClients:",Object.values(this.clients))
        return Object.values(this.clients);
    }


}
