import { Injectable } from '@hapiness/core';
import { HttpService } from '@hapiness/http';
import { Leaderboard, SlackResponse } from '../models';


@Injectable()
export class SlackService {
    constructor(private http: HttpService) { }

    public sendDelayedResponse(url, body) {
        return this.http.post(url, {
            headers: {
                'content-type': 'application/json'
            },
            body,
            json: true
        })
        .validateResponse()
    }
    public formatLadder(ladders: Leaderboard[]): SlackResponse {

        const result: any = {
            username: 'fifabot',
            response_type: 'in_channel',
            attachments: ladders.map((user) => ({
                title: user.user_name,
                text: `Current Position: *${user.position}* with *${user.points}* points`,
                mrkdwn_in: ['text']
            }))
        };

        result.attachments[0].pretext = 'Ladder';
        result.attachments[0].title = result.attachments[0].title.concat(' 👑');
        result.attachments[0].text = result.attachments[0].text.concat(' 🏅');
        result.attachments[0].color = '#D4AF37';
        result.attachments[1].text = result.attachments[1].text.concat(' 🥈');
        result.attachments[1].color = '#C0C0C0';
        result.attachments[2].text = result.attachments[2].text.concat(' 🥉');
        result.attachments[2].color = 'cd7f32';

        return result;
    }
}
