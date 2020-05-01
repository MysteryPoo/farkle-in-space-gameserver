
import { ISocket } from "./ISocket";

export interface IClient extends ISocket {
    uid : string;
    authenticated : boolean;

    lastConnectionError : Error;

    ValidateMessageId(identifier : number) : boolean;
}
