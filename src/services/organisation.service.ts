// import { Observable } from 'rxjs';
import { Injectable } from '@hapiness/core';
// import { Biim } from '@hapiness/biim';
// import { HttpService } from '@hapiness/http';
import '@hapiness/http/observable/add/validateResponse';
import { HttpService } from '@hapiness/http';
// import { FifaResult, Leaderboard, FifaResultResult } from '../models';
// import { Config } from '@hapiness/config';

@Injectable()
export class OrganisationService {
    private teams = null;
    private groups = null;
    private matchesPerDay = null;
    private knockout = null;
    private stadiums = null;
    constructor(private http: HttpService) {}

    public retrieveData() {
        return this.http.get('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json')
        .validateResponse()
        .do(_abc_ => require('fs').writeFileSync('../data.json', _abc_))
        .do((file: any) => {
            this.teams = file.teams;
            this.groups = file.groups;
            this.knockout = file.knockout;
            this.stadiums = file.stadiums;

            this.matchesPerDay = this.computeMatches();
        });
    }

    public getTeams() {
        return this.teams;
    }

    public getTodayMatches() {
        return ;
    }

    public getGroups(groupeName?: string) {
        if (!groupeName || groupeName) {
            return this.groups;
        }

        if (!this.groups[groupeName]) {
            return
        }

    }

    public getKnockOuts() {
        return this.knockout;
    }

    private computeMatches() {

    }

}
