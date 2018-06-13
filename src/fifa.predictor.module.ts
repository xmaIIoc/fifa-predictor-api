import { HapinessModule, OnStart, Inject, HttpServerExt, Server, HttpServerService } from '@hapiness/core';
import { PostFifaPredictorResultLeaderBoard, PostBearerRoute } from './routes';
import { FifaPredictorService } from './services';
import { HttpService } from '@hapiness/http';
import { Biim } from '@hapiness/biim';
import { Config } from '@hapiness/config';

@HapinessModule({
    version: '1.0.0',
    imports: [
    ],
    declarations: [
        PostFifaPredictorResultLeaderBoard,
        PostBearerRoute
    ],
    providers: [
        HttpServerService,
        HttpService,
        FifaPredictorService
    ],
    exports: [
        FifaPredictorService
    ]
})
export class FifaPredictorModule implements OnStart {
    private config;

    constructor(@Inject(HttpServerExt) private httpServer: Server, private server: HttpServerService) {
        this.config = Config.get<any>('fifa');
    }

    onStart() {
        console.log(`server started at ${this.httpServer.info.uri}`)
        this.setAuthValidation();
    }

    private setAuthValidation(): void {
        this.server.instance().auth.scheme('auth', () => ({
            authenticate: (request, reply) => {
                // TODO: add some real auth someday
                if (!request.query.token || request.query.token !== this.config.auth.token) {
                    reply(Biim.forbidden())
                }
                reply.continue({ credentials: 'toto' });
            }
        }));
        this.server.instance().auth.strategy('default', 'auth');
        this.server.instance().auth.default('default');
    }
}
