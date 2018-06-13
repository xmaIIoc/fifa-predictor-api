import { Entity, Type, Array } from '@juneil/entityts';

export class Leaderboard extends Entity {

    @Type(Number)
    points: number;

    @Type(Number)
    has_points: number;

    @Type(String)
    id: string;

    @Type(Number)
    position: number;

    @Type(String)
    user_name: string;

    @Type(Number)
    current_user: number;

    @Type(Number)
    rank_position: number;
}

export class FifaResultResult extends Entity {

    @Array(Leaderboard)
    leaderboard: Leaderboard[];

    @Array(Object)
    leaderboardNearBy: any[];

    @Type(Number)
    leaderboardItemsCount: number;

    @Type(Boolean)
    hasNext: boolean;
}

export class FifaResult extends Entity {

    @Type(Boolean)
    error: boolean;

    @Type(FifaResultResult)
    result: FifaResultResult

    @Type(String)
    message?: string;
}
