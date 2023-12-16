import { schema } from 'battlecode-schema'
import Game, { Team } from './Game'
import assert from 'assert'
import Turn from './Turn'

class TeamTurnStat {
    robots: number[] = Array(4).fill(0);
    total_hp: number[] = Array(4).fill(0);
    resourceAmount: number = 0
    resourceAmountAverageDatapoint: number | undefined = undefined

    copy(): TeamTurnStat {
        const newStat = Object.assign(Object.create(Object.getPrototypeOf(this)), this)

		// Copy any internal objects here

        return newStat
    }
}

export default class TurnStat {
    private readonly teams: Map<Team, TeamTurnStat>
    private readonly game: Game
    public completed: boolean = false

    constructor(game: Game, teams?: Map<Team, TeamTurnStat>) {
        this.game = game
        this.teams =
            teams ??
            new Map([
                [game.teams[0], new TeamTurnStat()],
                [game.teams[1], new TeamTurnStat()]
            ])
    }

    copy(): TurnStat {
        const newTeamStats = new Map(this.teams)
        for (const [team, stat] of this.teams) newTeamStats.set(team, stat.copy())
        const copy = new TurnStat(this.game, newTeamStats)
        copy.completed = this.completed
        return copy
    }

    /**
     * Mutates this stat to reflect the given delta.
     */
    applyDelta(turn: Turn, delta: schema.Round): void {
        assert(!this.completed, 'Cannot apply delta to completed turn')
        assert(
            turn.turnNumber === delta.roundId(),
            `Wrong turn ID: is ${delta.roundId()}, should be ${turn.turnNumber}`
        )

        for (var i = 0; i < delta.teamIdsLength(); i++) {
            const team = this.game.teams[(delta.teamIds(i) ?? assert.fail('teamID not found in round')) - 1]
            assert(team != undefined, `team ${i} not found in game.teams in turn`)
            const teamStat = this.teams.get(team) ?? assert.fail(`team ${i} not found in team stats in turn`)

            teamStat.resourceAmount =
                delta.teamResourceAmounts(i) ?? assert.fail('teamResourceAmounts not found in round')
        }

        const time = Date.now()
        for (const team of this.game.teams) {
            if (turn.turnNumber % 10 == 0) {
                const teamStat = this.teams.get(team) ?? assert.fail(`team ${team} not found in team stats in turn`)
                let avgValue = teamStat.resourceAmount
                let avgCount = 1
                for (let i = turn.turnNumber - 1; i >= Math.max(0, turn.turnNumber - 100); i--) {
                    const prevTurnStat = turn.match.stats[i].getTeamStat(team)
                    avgValue += prevTurnStat.resourceAmount
                    avgCount += 1
                }

                teamStat.resourceAmountAverageDatapoint = avgValue / avgCount
            }
        }
        const timems = Date.now() - time
        if (timems > 1) console.log(`took ${timems}ms to calculate income averages`)

        this.completed = true
    }

    public getTeamStat(team: Team): TeamTurnStat {
        return this.teams.get(team) ?? assert.fail(`team ${team} not found in team stats in turn`)
    }
}
