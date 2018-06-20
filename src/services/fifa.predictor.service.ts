import { Observable } from 'rxjs';
import { Injectable } from '@hapiness/core';
import { Biim } from '@hapiness/biim';
import { HttpService } from '@hapiness/http';
import '@hapiness/http/observable/add/validateResponse';
import { FifaResult, Leaderboard, FifaResultResult } from '../models';
import { Config } from '@hapiness/config';

@Injectable()
export class FifaPredictorService {
    private baseUrl = 'https://api-bracketchallenge.fifa.com/privateleaguerestapi/';
    private bearer = Config.get<string>('fifa.bearer');
    // private cache = {
    //     leaderboard: [],
    //     expiredAt: 0
    // };

    private offset = 0;

    constructor(private http: HttpService) { }

    getLeaderboard(leaderBoardId: string, params: any): any {
        // if (this.cache.expiredAt > Date.now()) {
        //     return Observable.of(this.cache.leaderboard);
        // }
        const limit = 10;
        const url = `${this.baseUrl}leaderboard/${leaderBoardId}/1/?limit=${limit}&offset=`;

        this.fetchItems(url)
            .toArray<Leaderboard>()
            .map(results => results.map(({ id, ...leaderboard }) => leaderboard as Leaderboard))
            // .do(result => {
            //     this.cache.leaderboard = result;
            //     this.cache.expiredAt = Date.now() + 36000
            // })
            // .flatMap(result => {
            // })
            .flatMap(result => params.response_url ? Observable.of(result) : Observable.throw('no response_url to answer'))
            .flatMap(result => {
                const res = this.formatLadder(result);

                return this.http.post(params.response_url, {
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: res,
                    json: true
                })
                .validateResponse();
            })
            .subscribe(null,
                err => console.log('Error => ', err)
            );
    }

    fetchItems(url): Observable<Leaderboard> {
        return this.doCall(url)
            .flatMap(({ leaderboard, hasNext }) => {
                const items$ = Observable.from(leaderboard);
                let next$;
                if (hasNext) {
                    this.offset += 10;
                    next$ = this.fetchItems(url);
                } else {
                    next$ = Observable.empty();
                }

                return Observable.concat(
                    items$,
                    next$
                );
            });
    }
    public setBearer(bearer: string): void {
        this.bearer = bearer;
    }

    private doCall(url: string): Observable<FifaResultResult> {
        return this.http.get(`${url}${this.offset}`, {
            headers: {
                'access-control-allow-headers': 'Apikey, Origin, X-Requested-With, Content-Type, Accept, Authorization, ApiKey',
                'Authorization': `bearer ${this.bearer}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .validateResponse<FifaResult>(FifaResult.schema())
            .flatMap(res => {
                if (res.error) {
                    console.error(`Got error => ${res.message}`);
                    return Observable.throw(Biim.internal(res.message))
                }

                return Observable.of(res.result);
            });
    }

    private formatLadder(ladders: Leaderboard[]): { username: string, response_type: string, attachements: any } {

        const result = {
            username: 'fifabot',
            response_type: 'in_channel',
            attachements: ladders.map((user) => ({
                title: user.user_name,
                text: `Current Position: ${user.position} with ${user.points} points`
            }))
        };

        (result.attachements[0] as any).pretext = 'Ladder';
        result.attachements[0].title = result.attachements[0].title.concat(' 👑');
        result.attachements[0].text = result.attachements[0].text.concat(' 🏅');
        result.attachements[1].text = result.attachements[1].text.concat(' 🥈');
        result.attachements[2].text = result.attachements[2].text.concat(' 🥉');

        return result;
    }
}
