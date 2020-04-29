
import { ServerBase } from "./Abstracts/ServerBase";
import { PingHandler } from "./Protocol/Common/Handlers/Ping";
import { IClient } from "./Interfaces/IClient";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { AuthenticationChallenge } from "./Protocol/Common/Messages/Challenge";
import { Socket } from "net";
import { IServer } from "./Interfaces/IServer";
import { UserClient } from "./UserClient";
import { IConnectionManager } from "./Interfaces/IConnectionManager";

export enum MESSAGE_ID {
    FIRST,
    "Challenge" = FIRST,
	"Handshake",
	"Ping",
    INVALID,
    LAST = INVALID
};

export class GameServerServer extends ServerBase implements IServer, IConnectionManager {

    socketMap: Map<string, IClient> = new Map();
    handlerList: IMessageHandler[] = [];

    constructor() {
        super();
        this.registerHandler<PingHandler>(MESSAGE_ID.Ping, PingHandler);

        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketMap.clear();
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });
    }

    handleDisconnect(client: IClient): void {
        this.socketMap.delete(client.uid);
        client.destroy();
    }

    removeClient(client: IClient): void {
        this.socketMap.delete(client.uid);
        client.destroy();
    }

    private onConnection(rawSocket : Socket) {
        const client = new UserClient(rawSocket, this.handlerList, this);
        this.socketMap.set(client.uid, client);

        let message : AuthenticationChallenge = new AuthenticationChallenge(MESSAGE_ID.Challenge);
        message.salt = "ABCD";
        client.write(message.serialize());
    }

}
