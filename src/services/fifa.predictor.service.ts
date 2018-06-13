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

    private offset = 0;

    constructor(private http: HttpService) { }

    getLeaderboard(leaderBoardId: string): Observable<Leaderboard[]> {
        const limit = 10;
        const url = `${this.baseUrl}leaderboard/${leaderBoardId}/1/?limit=${limit}&offset=`;

        return this.fetchItems(url)
            .toArray<Leaderboard>()
            .map(results => results.map(({ id, ...leaderboard }) => leaderboard as Leaderboard));
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

    setBearer(bearer: string): void {
        this.bearer = bearer;
    }
}
