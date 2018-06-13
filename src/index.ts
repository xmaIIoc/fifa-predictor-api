import { Hapiness, HttpServerExt } from '@hapiness/core';
import { Config } from '@hapiness/config';
import { FifaPredictorModule } from './fifa.predictor.module';

const httpServerConfig = <any> Object.assign({
    options: {
        connections: {
            routes: {
                cors: {
                    origin: ['*']
                }
            },
        }
    },
    // host: '0.0.0.0',
    // port: '4242'
}, Config.get('server'));

Hapiness
    .bootstrap(
        FifaPredictorModule,
        [
            HttpServerExt
                .setConfig(httpServerConfig)
        ]
    )
    .catch(err => {
        console.error(err);
    });
