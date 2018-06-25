import { Route, /* Request, */ OnGet } from '@hapiness/core';
import { FifaPredictorService, SlackService } from '../../services';
import { Observable } from 'rxjs/Observable';
import * as Joi from 'joi';

@Route({
    path: '/leaderboard/{leaderboardId}',
    method: 'GET',
    config: {
        validate: {
            params: {
                leaderboardId: Joi.string().required(),
            }
        },
        description: 'Get the leadeboard',
        tags: ['api', 'leaderboard']
    },
    providers: [ FifaPredictorService, SlackService ]
})
export class GetFifaPredictorResultLeaderBoard implements OnGet {
    constructor(/* private fifa: FifaPredictorService */) {}

    /**
     * OnGet implementation
     *
     * @param request
     */
    onGet(/* request: Request */): Observable<any> {
        return Observable.of(null);
        // console.log(`leaderboard ${request.params.leaderboardId}`);
        // return this.fifa.getLeaderboard(request.params.leaderboardId, null);
    }
}
