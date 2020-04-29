
import { config } from "dotenv";
import { Socket } from "net";
import { LobbyClient } from "./LobbyClient";
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { ISocket } from "./Interfaces/ISocket";

config();
const gameServerPort : number = Number(process.env.PORT);



class LobbyConnectionManager implements IConnectionManager {

    private lobbyInterface! : LobbyClient | undefined;

    constructor() {
        this.reconnect();
    }

    handleDisconnect(client: ISocket): void {
        if (client === this.lobbyInterface) {
            console.debug("Connection to lobby disrupted.");
            this.reconnect();
        }
    }

    private reconnect() : void {
        if (this.lobbyInterface) {
            this.lobbyInterface.destroy();
        }
        this.lobbyInterface = new LobbyClient(new Socket(), [], this, process.env.PASSWORD!, process.env.HOST!, {port : Number(process.env.AUTHPORT!), host : process.env.AUTHIP});
    }

}

var lobbyConnMgr : LobbyConnectionManager = new LobbyConnectionManager();

