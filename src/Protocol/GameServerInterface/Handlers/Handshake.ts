
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { ISocket } from "../../../Interfaces/ISocket";
import { Handshake } from "../Messages/Handshake";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: ISocket): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);

        if (message.valid) {
            // TODO : Do this ...
            let response : Handshake = new Handshake(this.messageId);
            response.error = 0;
            response.playerIndexOnServer = 0;

            myClient.write(response.serialize());
            return true;
        } else {
            return false;
        }
    }

}
