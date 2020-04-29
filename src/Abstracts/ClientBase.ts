
import { Socket, SocketConnectOpts } from "net";
import { v4 as uuid } from "uuid";
import { IClient } from "../Interfaces/IClient";
import { IMessageHandler } from "../Interfaces/IMessageHandler";
import { IConnectionManager } from "../Interfaces/IConnectionManager";

export abstract class ClientBase implements IClient {

    public uid : string = uuid();
    public authenticated : boolean = false;
    public isConnected : boolean = false;

    constructor(private socket : Socket, protected handlerList : IMessageHandler[], private connectionManager : IConnectionManager, connectionOptions? : SocketConnectOpts, onConnectCallback? : () => void) {

        if (connectionOptions) {
            socket.connect(connectionOptions, onConnectCallback);
        }

        this.socket.on('data', (data : Buffer) => {
            let tell : number = 0;
            while(tell < data.byteLength) {
                let rawIdentifier : number = data.readUInt8(tell);
                let messageSize : number = data.readUInt32LE(tell + 1);
                let messageData : Buffer = data.slice(tell + 5, tell + messageSize);

                if (this.ValidateMessageId(rawIdentifier)) {
                    if (this.handlerList[rawIdentifier]) {
                        this.handlerList[rawIdentifier].handle(messageData, this);
                    } else {
                        console.error(`No handler registered for this messageType: ${this.GetMessageTypeString(rawIdentifier)}(${rawIdentifier})`);
                    }
                } else {
                    console.error(`Unknown messageType: ${rawIdentifier}`);
                }
                tell += messageSize;
            }
        })
        .on('error', (err : Error) => {
            console.error(err);
        })
        .on('close', (had_error) => {
            if (had_error) {
                console.error("Unknown error ocurred when client disconnected.");
            } else {
                console.debug(`Console: Socket has closed.`);
            }
            this.isConnected = false;
            this.connectionManager.handleDisconnect(this);
        });
    }

    abstract ValidateMessageId(identifier : number): boolean;

    abstract GetMessageTypeString(identifier : number) : string;

    public write(buffer : Buffer) : boolean {
        this.isConnected = this.socket.write(buffer);
        return this.isConnected;
    }

    public destroy() : void {
        this.socket.destroy();
        this.socket.unref();
    }

}
