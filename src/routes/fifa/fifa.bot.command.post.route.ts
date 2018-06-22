import { OnPost, Route, Request, ReplyNoContinue } from '@hapiness/core';
import { FifaPredictorService, OrganisationService } from '../../services';
import { Observable } from 'rxjs/Observable';
import * as Joi from 'joi';

@Route({
    path: '/fifa',
    method: 'POST',
    config: {
        validate: {
            query: {
                leaderboard: Joi.string(),
                token: Joi.string()
            }
        },
        description: 'Get the leadeboard',
        tags: ['api', 'leaderboard']
    },
    providers: [ FifaPredictorService ]
})
export class PostFifaSlackBotCommandRoute implements OnPost {
    private commands = null;
    constructor(private fifa: FifaPredictorService/* , private organisation: OrganisationService */) {
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
        const command = this.commands[request.payload.text];

        if (!command) {
            reply({
                response_type: 'ephemeral',
                text: '???',
            })
            .header('Content-Type', 'application/json');

            return;
        }

        reply({
            username: 'fifabot',
            response_type: 'ephemeral',
            text: 'I need some times to prepare everything hang up there!'
        });
        return command(request.payload, request.query.leaderboard);
    }
}
