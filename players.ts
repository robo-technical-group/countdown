namespace Players {
    const ACCENT_COLORS: number[] = [
        0, // no player zero
        Color.Red, // Player 1
        Color.Aqua, // Player 2
        Color.Orange, // Player 3
        Color.BrightGreen, // Player 4
    ]

    let registered: boolean[] = [false, false, false, false, false,]

    export function register(player: number): void {
        if (registered[player]) {
            return
        }

        // music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
        registered[player] = true
        setScore(player, 0)
    }

    export function changeScoreBy(player: number, delta: number): void {
        switch (player) {
            case 1:
                info.changeScoreBy(delta)
                break

            case 2:
                info.player2.changeScoreBy(delta)
                break

            case 3:
                info.player3.changeScoreBy(delta)
                break

            case 4:
                info.player4.changeScoreBy(delta)
                break
        }
    }

    export function score(player: number): number {
        switch (player) {
            case 1:
                return info.score()

            case 2:
                return info.player2.score()

            case 3:
                return info.player3.score()

            case 4:
                return info.player4.score()
        }
        return -1
    }

    export function setScore(player: number, score: number): void {
        switch (player) {
            case 1:
                info.player1.setScore(score)
                break

            case 2:
                info.player2.setScore(score)
                break

            case 3:
                info.player3.setScore(score)
                break

            case 4:
                info.player4.setScore(score)
                break
        }
    }
}