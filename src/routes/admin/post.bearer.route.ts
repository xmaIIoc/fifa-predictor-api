import { OnPost, Route, Request, ReplyNoContinue } from '@hapiness/core';
import { FifaPredictorService } from '../../services';
import * as Joi from 'joi';

@Route({
    path: '/bearer',
    method: 'POST',
    config: {
        validate: {
            payload: {
                bearer: Joi.string().required(),
            }
        },
        description: 'Set a valid bearer',
        tags: ['api', 'bearer', 'admin' ]
    },
    providers: [ FifaPredictorService ]
})
export class PostBearerRoute implements OnPost {
    constructor(private fifa: FifaPredictorService) {}

    /**
     * OnGet implementation
     *
     * @param request
     */
    onPost(request: Request, reply?: ReplyNoContinue): void {
        console.log(`bearer ${request.payload.bearer}`);
        this.fifa.setBearer(request.payload.bearer);
        reply();
    }
}
