
import { config } from "dotenv";
import { GameServerServer } from "./GameServer";

config();
const gameServerPort : number = Number(process.env.PORT);

const gameServerManager : GameServerServer = new GameServerServer();

