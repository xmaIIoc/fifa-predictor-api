import { OnPost, Route, Request } from '@hapiness/core';
import { FifaPredictorService } from '../../services';
import { Observable } from 'rxjs/Observable';
import * as Joi from 'joi';

@Route({
    path: '/leaderboard/{leaderboardId}',
    // POST so that slack can query it.
    method: 'POST',
    config: {
        validate: {
            params: {
                leaderboardId: Joi.string().required(),
            }
        },
        description: 'Get the leadeboard',
        tags: ['api', 'leaderboard']
    },
    providers: [ FifaPredictorService ]
})
export class PostFifaPredictorResultLeaderBoard implements OnPost {
    constructor(private fifa: FifaPredictorService) {}

    /**
     * OnGet implementation
     *
     * @param request
     */
    onPost(request: Request): Observable<any> {
        console.log(`leaderboard ${request.params.leaderboardId}`);
        return this.fifa.getLeaderboard(request.params.leaderboardId);
    }
}
