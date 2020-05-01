
import { config } from "dotenv";
import { GameServer } from "./GameServer";
import { LobbyConnectionManager } from "./LobbyConnectionManager";

config();
const gameServerPort : number = Number(process.env.PORT);

var lobbyConnMgr : LobbyConnectionManager = new LobbyConnectionManager();

const gameServer : GameServer = new GameServer(lobbyConnMgr);
console.debug(gameServerPort);
gameServer.start(gameServerPort);

setTimeout( () => {
    gameServer.getConnections( (err, count : number) => {
        if (count === 0) {
            console.debug("Shutting down... No one has connected before the timeout.");
            gameServer.close();
            gameServer.unref();
            lobbyConnMgr.destroy();
        }
    });
}, 5000);
