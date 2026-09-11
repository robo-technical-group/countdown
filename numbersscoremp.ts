namespace Countdown {
    const NUMBER_SCORE_LEFTS: number[] = [0, 10, 90, 130,]
    const NUMBER_SCORE_MISS: string = "Miss"
    const NUMBER_SCORE_HEADERS: string[] = [
        "P",
        "Soln",
        "Bid",
        "Score",
    ]
    const NUMBER_SCORE_HEADER_OFFSETS: number[] = [0, 0, 0, 10,]
    const NUMBER_SCORE_INSTRUCTIONS: string = "Player 1 Press A"
    const NUMBER_SOLUTION_HEADER: string = "Solution:"

    let numberClosestSolution: number = 0
    let numberScoreBidValidSprites: Sprite[] = []
    let numberScoreBidsValid: boolean[] = []
    let numberScoreBidSprites: TextSprite[] = []
    let numberScoreCurrentColumn: number = 0
    let numberScoreCurrentPlayer: number = 0
    let numberScorePlayers: TextSprite[] = []
    let numberScores: number[] = []
    let numberScoreSprites: TextSprite[] = []
    let numberScoreSolutionSprites: TextSprite[] = []
    let numberScoreUpdateDone: boolean = false
    let numberSolutions: number[] = []
    let numberSolutionSprite: fancyText.TextSprite = null

    export function beginNumbersScoreMp(): void {
        clearNumbersScoreMp()
        numberClosestSolution = 999
        numberScoreCurrentColumn = 0
        numberScoreCurrentPlayer = 1
        numberScoreBidsValid = [false, false, false, false, false,]
        numberSolutions = [0, 0, 0, 0, 0,]
        numberScores = [0, 0, 0, 0, 0,]
        numberScoreUpdateDone = false
        createNumbersScoreBoard()
    }

    function buildNumbersSolution(): void {
        /*
        numberSolutionSprite = fancyText.create(
            NUMBER_SOLUTION_HEADER +
                "\nLine1\nLine2\nLine3\nLine4\n1000 x 100 = 100000",
            null, Color.Yellow, fancyText.bold_sans_7
        )
        */
        numberSolutionSprite = fancyText.create(
            NUMBER_SOLUTION_HEADER +
                "\n" + Countdown.getNumbersSolution(),
            null, Color.Yellow, fancyText.bold_sans_7
        )
        numberSolutionSprite.setKind(SpriteKind.NumbersBoardScore)
        numberSolutionSprite.x = 80
        numberSolutionSprite.top = 0
        numberSolutionSprite.setFlag(SpriteFlag.Invisible, true)
    }

    export function clearNumbersScoreMp(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.NumbersBoardScore)
        numberScoreSolutionSprites = [null, null, null, null, null,]
        numberScorePlayers = [null, null, null, null, null,]
        numberScoreBidSprites = [null, null, null, null, null,]
        numberScoreBidValidSprites = [null, null, null, null, null,]
        numberScoreSprites = [null, null, null, null, null,]
    }

    function createNumbersScoreBoard(): void {
        let top: number = 10
        buildNumbersSolution()

        top = 57
        createNumbersScoreHeaders(top)

        top += 11
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p)) {
                createNumberSpritesForPlayer(p, top)
                top += 11
            }
        }
    }

    function createNumbersScoreHeaders(top: number): void {
        for (let i: number = 0; i < NUMBER_SCORE_HEADERS.length; i++) {
            let _: TextSprite =
                createNumbersScoreTextSprite(
                    NUMBER_SCORE_HEADERS[i],
                    Color.White,
                    NUMBER_SCORE_LEFTS[i] - NUMBER_SCORE_HEADER_OFFSETS[i],
                    top, true
                )
        }
    }

    function createNumbersScoreSprite(
        img: Image, left: number, top: number, visible: boolean
    ): Sprite {
        let s: Sprite = sprites.create(img, SpriteKind.NumbersBoardScore)
        s.setFlag(SpriteFlag.Ghost, true)
        s.left = left
        s.top = top
        if (!visible) {
            s.setFlag(SpriteFlag.Invisible, true)
        }
        return s
    }

    function createNumbersScoreTextSprite(
        text: string, color: number, left: number, top: number, visible: boolean
    ): TextSprite {
        let ts: TextSprite = textsprite.create(text, 0, color)
        ts.setBorder(1, 0, 1)
        ts.left = left
        ts.top = top
        ts.setKind(SpriteKind.NumbersBoardScore)
        if (!visible) {
            ts.setFlag(SpriteFlag.Invisible, true)
        }
        return ts
    }

    function createNumberSpritesForPlayer(player: number, top: number): void {
        let accentColor: number = Players.accentColor(player)
        let target: number = Countdown.getTarget()
        let bid: number = Countdown.getNumbersBid(player)
        let solution: number = Countdown.getPlayerNumberSolution(player)
        let difference: number = Math.abs(target - solution)
        numberSolutions[player] = solution

        let p: TextSprite = createNumbersScoreTextSprite(
            player.toString(), accentColor,
            NUMBER_SCORE_LEFTS[0], top, true)
        numberScorePlayers[player] = p

        let solnSprite: TextSprite = createNumbersScoreTextSprite(
            solution.toString(), accentColor,
            NUMBER_SCORE_LEFTS[1], top, false
        )
        numberScoreSolutionSprites[player] = solnSprite

        let bidText: TextSprite = createNumbersScoreTextSprite(
            difference > 10 || bid == 0 || solution == 0 ?
                NUMBER_SCORE_MISS :
                bid.toString(),
            accentColor,
            NUMBER_SCORE_LEFTS[2], top, false
        )
        numberScoreBidSprites[player] = bidText

        let bidValid: boolean = (
            bid > 0 &&
            bid == solution
        )
        numberScoreBidsValid[player] = bidValid
        let bidValidSprite: Sprite = createNumbersScoreSprite(
            bidValid ?
                assets.image`greenCheck` :
                assets.image`redX`,
            NUMBER_SCORE_LEFTS[2] - 12, top, false
        )
        numberScoreBidValidSprites[player] = bidValidSprite

        let score: number = 0
        if (bidValid) {
            if (difference == 0) {
                score = 10
            } else if (difference < 6) {
                score = 7
            } else if (difference < 11) {
                score = 5
            }
            if (difference < numberClosestSolution) {
                numberClosestSolution = difference
            }
        }
        numberScores[player] = score
        let scoreSprite: TextSprite = createNumbersScoreTextSprite(
            score.toString(), Color.White,
            NUMBER_SCORE_LEFTS[3], top, false
        )
        numberScoreSprites[player] = scoreSprite
    }

    export function getNumbersScore(player: number): number {
        if (player < 1 || player > 4) {
            return 0
        }
        return numberScores[player]
    }

    function showNumberScoreInstructions(): void {
        let t: fancyText.TextSprite = fancyText.create(
            NUMBER_SCORE_INSTRUCTIONS, null,
            Color.Yellow, fancyText.bold_sans_7
        )
        t.bottom = 121
        t.setKind(SpriteKind.NumbersBoardScore)
    }

    export function updateNumbersScore(): void {
        if (numberScoreUpdateDone) {
            return
        }
        let updated: boolean = false
        while (!updated) {
            switch (numberScoreCurrentColumn) {
                // Player solution and bid
                case 0:
                    if (Players.isRegistered(numberScoreCurrentPlayer)) {
                        numberScoreSolutionSprites[numberScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        numberScoreBidSprites[numberScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        updated = true
                    }
                    break
                
                // Solution
                case 1:
                    numberSolutionSprite.setFlag(SpriteFlag.Invisible, false)
                    numberScoreCurrentPlayer = 99
                    updated = true
                    break
                
                // Bid valid
                case 2:
                    if (Players.isRegistered(numberScoreCurrentPlayer)) {
                        numberScoreBidValidSprites[numberScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        if (numberScoreBidsValid[numberScoreCurrentPlayer]) {
                            music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                        } else {
                            music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
                        }
                        updated = true
                    }
                    break
                
                // Score
                case 3:
                    if (Players.isRegistered(numberScoreCurrentPlayer)) {
                        numberScoreSprites[numberScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        updated = true
                    }
                    break
                
                // Register scores
                case 4:
                    if (Players.isRegistered(numberScoreCurrentPlayer)) {
                        if (g_scoreMode.name[0] == "C") {
                            // Competitive scoring
                        } else {
                            // Friendly scoring
                            numberScoreSprites[numberScoreCurrentPlayer].setBorder(1, Color.White, 1)
                            music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                            Players.changeScoreBy(numberScoreCurrentPlayer, numberScores[numberScoreCurrentPlayer])
                        }
                        updated = true
                    }
                    break
                
                // Finish
                case 5:
                    showNumberScoreInstructions()
                    numberScoreCurrentPlayer = 99
                    updated = true
                    break
            }
            numberScoreCurrentPlayer++
            if (numberScoreCurrentPlayer > 4) {
                numberScoreCurrentPlayer = 1
                numberScoreCurrentColumn++
                if (numberScoreCurrentColumn > 5) {
                    updated = true
                    numberScoreUpdateDone = true
                }
            }
        }
    }

    export function updateNumberScoreDone(): boolean {
        return numberScoreUpdateDone
    }
}