/// TODO : Rename to AuthenticationChallenge
import { MessageBase } from "../../Abstracts/MessageBase";
import { BufferHelper } from "../../BufferHelper";

const size = 6;

export class AuthenticationChallenge extends MessageBase {

    public salt! : string;
    
    serialize(): Buffer {
        let saltLength : number = Buffer.byteLength(this.salt, 'utf-8');
        let bufferSize : number = size + saltLength;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(saltLength);
        helper.writeString(this.salt);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
