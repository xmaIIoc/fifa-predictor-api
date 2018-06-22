import { Entity, Type, Array } from '@juneil/entityts';

export class SlackResponse extends Entity {
    @Type(String)
    username: string;

    @Type(String)
    response_type: string;

    @Array(Object)
    attachments?: any;
}
