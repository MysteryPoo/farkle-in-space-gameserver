
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { LobbyClient } from "./LobbyClient";
import { ISocket } from "./Interfaces/ISocket";
import { Socket } from "net";

export class LobbyConnectionManager implements IConnectionManager {

    private lobbyInterface! : LobbyClient | undefined;

    constructor() {
        this.reconnect();
    }

    destroy() : void {
        if (this.lobbyInterface) {
            this.lobbyInterface.destroy();
        }
    }

    handleDisconnect(client: ISocket): void {
        if (client === this.lobbyInterface) {
            console.debug("Connection to lobby disrupted.");
            this.lobbyInterface.destroy();
        }
    }

    private reconnect() : void {
        if (this.lobbyInterface) {
            console.debug(this.lobbyInterface.lastConnectionError);
            this.lobbyInterface.destroy();
        }
        this.lobbyInterface = new LobbyClient(new Socket(), [], this, process.env.PASSWORD!, process.env.HOST!, {port : Number(process.env.AUTHPORT!), host : process.env.AUTHIP});
    }

    getLobby() : LobbyClient | undefined {
        return this.lobbyInterface;
    }

}
