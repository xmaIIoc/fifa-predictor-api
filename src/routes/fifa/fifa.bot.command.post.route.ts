import { OnPost, Route, Request, ReplyNoContinue } from '@hapiness/core';
import { FifaPredictorService } from '../../services';
import { Observable } from 'rxjs/Observable';
import * as Joi from 'joi';

@Route({
    path: '/fifa',
    // POST so that slack can query it.
    method: 'POST',
    config: {
        // auth: false,
        validate: {
            query: {
                leaderboard: Joi.string(),
            }
        },
        description: 'Get the leadeboard',
        tags: ['api', 'leaderboard']
    },
    providers: [ FifaPredictorService ]
})
export class PostFifaSlackBotCommandRoute implements OnPost {
    private commands = null;
    constructor(private fifa: FifaPredictorService) {
        this.commands = {
            leaderboard: (params, leaderboard) => this.fifa.getLeaderboard(leaderboard, params),
            result: (params, leaderboard) => this.fifa.getLeaderboard(leaderboard, params),
            today: ''
        }
    }

    /**
     * OnGet implementation
     *
     * @param request
     */
    onPost(request: Request, reply: ReplyNoContinue): Observable<any> {
        console.log(`request.params => `, request.params);
        const command = this.commands[request.params.text];

        if (!command) {
            reply({
                response_type: 'ephemeral',
                text: '???',
            })
            .header('Content-Type', 'application/json');

            return;
        }

        reply();
        return command(request.params, request.query.leaderboard, request.params);
        // return ;
    }
}
