namespace Players {
    const ACCENT_COLORS: number[] = [
        0, // no player zero
        Color.Red, // Player 1
        Color.Aqua, // Player 2
        Color.Orange, // Player 3
        Color.BrightGreen, // Player 4
    ]

    let registeredPlayers: number[] = []
    let registered: boolean[] = [false, false, false, false, false,]

    export function accentColor(player: number): number {
        if (player < 1 || player > 4) {
            return -1
        }
        return ACCENT_COLORS[player]
    }

    export function isRegistered(player: number): boolean {
        if (player < 1 || player > 4) {
            return false
        }
        return registered[player]
    }

    export function numPlayers(): number {
        if (registeredPlayers.length == 0) {
            initRegisteredArray()
        }
        return registeredPlayers.length
    }
    
    export function register(player: number): void {
        if (registered[player]) {
            return
        }

        registered[player] = true
        if (registeredPlayers.length > 0) {
            registeredPlayers = []
        }
        setScore(player, 0)
    }

    export function unregister(player: number): void {
        registered[player] = false
        if (registeredPlayers.length > 0) {
            registeredPlayers = []
        }
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

    export function getNextPlayer(currentPlayer: number): number {
        if (registeredPlayers.length == 0) {
            initRegisteredArray()
        }
        let i: number = registeredPlayers.indexOf(currentPlayer)
        if (i < 0) {
            return -1
        }
        i++
        if (i < registeredPlayers.length) {
            return registeredPlayers[i]
        } else {
            return registeredPlayers[0]
        }
    }

    export function getRandomPlayer(): number {
        if (registeredPlayers.length == 0) {
            initRegisteredArray()
        }
        return registeredPlayers._pickRandom()
    }

    function initRegisteredArray(): void {
        for (let i: number = 1; i < 5; i++) {
            if (registered[i]) {
                registeredPlayers.push(i)
            }
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