namespace Countdown {
    const HIGH_SCORE_INSTRUCTIONS: string[] = [
        "Player 1",
        "Press A for new game",
    ]
    const HIGH_SCORE_INDICATOR: string = "High score!"
    const HIGH_SCORE_LABEL: string = "Current High Score"
    const HIGH_SCORE_PLAYER: string = "Player "
    const HIGH_SCORE_SETTINGS_PREFIX: string = "HIGH_SCORE_"
    const HIGH_SCORE_TITLE: string = "Final Scores"
    const HIGH_SCORE_SPEED: number = -100

    let currHighScore: number = 0
    let currHighScorePlayer: number = 0
    let highScoreFinished: boolean = false
    let highScoreKey: string = ""
    let highScoreLastY: number = 0
    let nextScore: number = 0
    let playerOrder: number[] = []

    export function allScoresRevealed(): boolean {
        return highScoreFinished
    }

    export function beginFinalScores(): void {
        highScoreFinished = false
        playerOrder = [0,] // 0 represents the current high score.
        highScoreKey = HIGH_SCORE_SETTINGS_PREFIX +
            g_gameType.name.charAt(0) + "_" +
            g_scoreMode.name.charAt(0) + "_" +
            Players.numPlayers().toString()
        if (!settings.exists(highScoreKey)) {
            settings.writeNumber(highScoreKey, -1)
        }
        currHighScore = settings.readNumber(highScoreKey)
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p)) {
                playerOrder.push(p)
            }
        }
        playerOrder.sort((a: number, b: number) => {
            return (
                (b == 0 ? currHighScore : Players.score(b)) -
                (a == 0 ? currHighScore : Players.score(a))
            )
        })
        nextScore = 0
        currHighScorePlayer = 0
    }

    export function clearFinalScores(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.FinalScores)
    }

    function sendText(text: string, font: fancyText.BaseFont, color: number, x: number, finalY: number): void {
        let f: fancyText.TextSprite = fancyText.create(text, null, color, font)
        f.x = x
        f.y = 125
        f.vy = HIGH_SCORE_SPEED
        f.data = finalY
        f.setKind(SpriteKind.FinalScores)
    }

    function stopSprites(): void {
        for (let s of sprites.allOfKind(SpriteKind.FinalScores)) {
            let finalY: number = <number>s.data
            if (s.y <= finalY) {
                s.vy = 0
            }
        }
    }

    export function updateFinalScores(stopOnly: boolean = false): void {
        stopSprites()
        if (stopOnly || highScoreFinished) {
            return
        }
        let updated: boolean = false
        while (!updated) {
            switch (nextScore) {
                case 0:
                    sendText(HIGH_SCORE_TITLE, fancyText.art_deco_11, Color.LightBlue, 80, 10)
                    nextScore++
                    updated = true
                    break
                
                case 1:
                    sendText(g_gameType.name, fancyText.art_deco_11, Color.LightBlue, 80, 25)
                    nextScore++
                    updated = true
                    break
                
                case 2:
                    sendText(g_scoreMode.name, fancyText.art_deco_11, Color.LightBlue, 80, 40)
                    nextScore++
                    highScoreLastY = 45
                    updated = true
                    break
                
                case 3:
                    if (currHighScorePlayer >= playerOrder.length) {
                        nextScore++
                    } else {
                        if (playerOrder[currHighScorePlayer] == 0) {
                            if (currHighScore > -1) {
                                highScoreLastY += 12
                                sendText(HIGH_SCORE_LABEL, fancyText.bold_sans_7, Color.Yellow, 40, highScoreLastY)
                                sendText(currHighScore.toString(), fancyText.bold_sans_7, Color.Yellow, 70, highScoreLastY)
                                updated = true
                            }
                            currHighScorePlayer++
                        } else {
                            highScoreLastY += 12
                            let player: number = playerOrder[currHighScorePlayer]
                            sendText(HIGH_SCORE_PLAYER + player,
                                fancyText.bold_sans_7,
                                Players.accentColor(player),
                                40, highScoreLastY
                            )
                            sendText(Players.score(player).toString(),
                                fancyText.bold_sans_7,
                                Players.accentColor(player),
                                70, highScoreLastY
                            )
                            if (Players.score(player) > currHighScore && currHighScorePlayer == 0) {
                                sendText(HIGH_SCORE_INDICATOR,
                                    fancyText.bold_sans_7,
                                    Players.accentColor(player),
                                    120, highScoreLastY
                                )
                            }
                            currHighScorePlayer++
                            updated = true
                        }
                    }
                    break
                
                case 4:
                    highScoreLastY = 105
                    for (let i of HIGH_SCORE_INSTRUCTIONS) {
                        sendText(
                            i,
                            fancyText.bold_sans_7,
                            Color.White, 80, highScoreLastY
                        )
                        highScoreLastY += 10
                    }
                    nextScore++
                    updated = true
                    break
                
                case 5:
                    updated = true
                    highScoreFinished = true
                    break
            }
        }
    }
}