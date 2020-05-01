
import { ServerBase } from "./Abstracts/ServerBase";
import { IClient } from "./Interfaces/IClient";
import { Socket } from "net";
import { IServer } from "./Interfaces/IServer";
import { UserClient } from "./UserClient";
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { LobbyConnectionManager } from "./LobbyConnectionManager";
import { Challenge } from "./Protocol/GameServerInterface/Messages/Challenge";
import { HandshakeHandler } from "./Protocol/GameServerInterface/Handlers/Handshake";

export enum MESSAGE_ID {
    FIRST,
    CHALLENGE = FIRST,
	HANDSHAKE,
	PING,
	PLAYERDATA,
	ROLLDICE,
	ROLLEVENTDICE,
	CHANGEDIE,
	NEXTTURN,
	TAKEACTION,
	PENDINGCARD,
	USECARD,
	DIEGRABBER,
	DIEGRABBERRELEASE,
	BRAWLTARGET,
	BRAWLINFO,
	DESTROYFLEET,
	STEALFLEET,
	ENTERORBIT,
	GAMEOVER,
	SETVOIP,
	VOIPDATA,
    INVALID,
    LAST = INVALID
};

export class GameServer extends ServerBase implements IServer, IConnectionManager {

    constructor(private lobbyConnMgr : LobbyConnectionManager) {
        super();
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.HANDSHAKE, HandshakeHandler);

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
        this.removeClient(client);

        if (this.socketMap.size === 0) {
            console.debug("Shutting down... No users connected.");
            this.lobbyConnMgr.destroy();
            this.close();
            this.unref();
        }
    }

    removeClient(client: IClient): void {
        this.socketMap.delete(client.uid);
        client.destroy();
    }

    private onConnection(rawSocket : Socket) {
        const client = new UserClient(rawSocket, this.handlerList, this);
        this.socketMap.set(client.uid, client);

        let message : Challenge = new Challenge(MESSAGE_ID.CHALLENGE);
        client.write(message.serialize());
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
            this.port = port;
            this.listen( {port: port, host: "0.0.0.0"}, () => {
                resolve(true);
            });
        });
    }

}
