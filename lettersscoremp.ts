namespace Countdown {
    const LETTER_SOLUTION_PREFIX: string = "Did you find "
    const LETTER_SOLUTION_SUFFIX: string = "?"
    const LETTER_SCORE_LEFTS: number[] = [0, 10, 90, 115, 140,]
    const LETTER_SCORE_INSTRUCTIONS: string = "Player 1 Press A"

    let letterHighScore: number = 0
    let letterScoreCurrentColumn: number = 0
    let letterScoreCurrentPlayer: number = 0
    let letterScorePlayers: TextSprite[] = []
    let letterScorePlayerWords: TextSprite[] = []
    let letterScoreBids: boolean[] = []
    let letterScoreBidSprites: Sprite[] = []
    let letterScoreBidTextSprites: TextSprite[] = []
    let letterScoreValid: boolean[] = []
    let letterScoreValidSprites: Sprite[] = []
    let letterScores: number[] = []
    let letterScoreSolutionSprite: fancyText.TextSprite = null
    let letterScoreSprites: TextSprite[] = []
    let letterScoreUpdateDone: boolean = false

    export function beginLettersScoreMp(): void {
        clearLettersScoreMp()
        letterHighScore = 0
        letterScoreCurrentColumn = 0
        letterScoreCurrentPlayer = 1
        letterScoreBids = [false, false, false, false, false,]
        letterScoreValid = [false, false, false, false, false,]
        letterScores = [0, 0, 0, 0, 0,]
        letterScoreUpdateDone = false
        createLettersScoreBoard()
    }

    function createLettersScoreBoard(): void {
        let top: number = 10
        letterScoreSolutionSprite = fancyText.create(
            LETTER_SOLUTION_PREFIX + Countdown.getLetterSolution() + LETTER_SOLUTION_SUFFIX,
            null, Color.Yellow, fancyText.bold_sans_7
        )
        letterScoreSolutionSprite.top = top
        letterScoreSolutionSprite.x = 80
        letterScoreSolutionSprite.setFlag(SpriteFlag.Invisible, true)
        letterScoreSolutionSprite.setKind(SpriteKind.LettersBoardScore)

        top += 12
        let puzzleSprite: TextSprite = textsprite.create(
            Countdown.getLetterPuzzle(), Color.Blue, Color.White
        )
        puzzleSprite.setMaxFontHeight(12)
        puzzleSprite.setBorder(1, Color.LightBlue, 1)
        puzzleSprite.top = top
        puzzleSprite.x = 80
        puzzleSprite.setKind(SpriteKind.LettersBoardScore)

        top += 15
        createLettersScoreHeaders(top)

        top += 15
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p)) {
                createLetterSpritesForPlayer(p, top)
                top += 15
            }
        }
    }

    export function clearLettersScoreMp(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.LettersBoardScore)
        letterScorePlayers = [null, null, null, null, null,]
        letterScorePlayerWords = [null, null, null, null, null,]
        letterScoreBidSprites = [null, null, null, null, null,]
        letterScoreBidTextSprites = [null, null, null, null, null,]
        letterScoreValidSprites = [null, null, null, null, null,]
        letterScoreSprites = [null, null, null, null, null,]
    }

    function createLettersScoreHeaders(top: number): void {
        let _: TextSprite = null
        _ = createLettersScoreTextSprite("P", Color.White, LETTER_SCORE_LEFTS[0], top, true)
        _ = createLettersScoreTextSprite("Word", Color.White, LETTER_SCORE_LEFTS[1], top, true)
        _ = createLettersScoreTextSprite("Bid", Color.White, LETTER_SCORE_LEFTS[2] - 10, top, true)
        _ = createLettersScoreTextSprite("Valid", Color.White, LETTER_SCORE_LEFTS[3] - 15, top, true)
        _ = createLettersScoreTextSprite("Score", Color.White, LETTER_SCORE_LEFTS[4] - 12, top, true)
    }

    function createLettersScoreSprite(
        img: Image, left: number, top: number, visible: boolean
    ): Sprite {
        let s: Sprite = sprites.create(img, SpriteKind.LettersBoardScore)
        s.setFlag(SpriteFlag.Ghost, true)
        s.left = left
        s.top = top
        if (!visible) {
            s.setFlag(SpriteFlag.Invisible, true)
        }
        return s
    }

    function createLettersScoreTextSprite(
        text: string, color: number, left: number, top: number, visible: boolean
    ): TextSprite {
        let ts: TextSprite = textsprite.create(text, 0, color)
        ts.setBorder(1, 0, 1)
        ts.left = left
        ts.top = top
        ts.setKind(SpriteKind.LettersBoardScore)
        if (!visible) {
            ts.setFlag(SpriteFlag.Invisible, true)
        }
        return ts
    }

    function createLetterSpritesForPlayer(player: number, top: number): void {
        let accentColor: number = Players.accentColor(player)
        let playerSolution: string = Countdown.getPlayerLetterSolution(player)

        let p: TextSprite = createLettersScoreTextSprite(player.toString(), accentColor,
            LETTER_SCORE_LEFTS[0], top, true)
        letterScorePlayers[player] = p

        let word: TextSprite = createLettersScoreTextSprite(
            playerSolution, accentColor,
            LETTER_SCORE_LEFTS[1], top, false
        )
        letterScorePlayerWords[player] = word

        letterScoreBids[player] = Countdown.getPlayerBid(player) == playerSolution.length
        let bidText: TextSprite = createLettersScoreTextSprite(
            Countdown.getPlayerBid(player).toString(),
            accentColor, LETTER_SCORE_LEFTS[2], top, false
        )
        letterScoreBidTextSprites[player] = bidText

        let bid: Sprite = createLettersScoreSprite(
            letterScoreBids[player] ?
                assets.image`greenCheck` :
                assets.image`redX`,
            LETTER_SCORE_LEFTS[2] - 12, top, false
        )
        letterScoreBidSprites[player] = bid

        letterScoreValid[player] = WordLists.isWordValid(playerSolution)
        let valid: Sprite = createLettersScoreSprite(
             letterScoreValid[player] ?
                assets.image`greenCheck` :
                assets.image`redX`,
            LETTER_SCORE_LEFTS[3], top, false
        )
        letterScoreValidSprites[player] = valid

        let score: number = 0
        if (letterScoreBids[player] && letterScoreValid[player]) {
            score = playerSolution.length == 9 ?
                19 : playerSolution.length
        }
        letterScores[player] = score
        if (score > letterHighScore) {
            letterHighScore = score
        }
            
        let scoreSprite: TextSprite = createLettersScoreTextSprite(
            letterScores[player].toString(), Color.White,
            LETTER_SCORE_LEFTS[4], top, false
        )
        letterScoreSprites[player] = scoreSprite
    }

    export function getLettersScore(player: number): number {
        if (player < 1 || player > 4) {
            return 0
        }
        return letterScores[player]
    }

    function showLetterScoreInstructions(): void {
        let t: fancyText.TextSprite = fancyText.create(
            LETTER_SCORE_INSTRUCTIONS, null,
            Color.Yellow, fancyText.bold_sans_7
        )
        t.bottom = 119
        t.setKind(SpriteKind.LettersBoardScore)
    }

    export function updateLettersScore(): void {
        if (letterScoreUpdateDone) {
            return
        }
        let updated: boolean = false
        while (!updated) {
            switch (letterScoreCurrentColumn) {
                // Player
                case 0:
                    if (Players.isRegistered(letterScoreCurrentPlayer)) {
                        letterScorePlayerWords[letterScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        letterScoreBidTextSprites[letterScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        updated = true
                    }
                    break
                
                // Solution
                case 1:
                    letterScoreSolutionSprite.setFlag(SpriteFlag.Invisible, false)
                    letterScoreCurrentPlayer = 99
                    updated = true
                    break
                
                // Bid Valid
                case 2:
                    if (Players.isRegistered(letterScoreCurrentPlayer)) {
                        letterScoreBidSprites[letterScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        if (letterScoreBids[letterScoreCurrentPlayer]) {
                            music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                        } else {
                            music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
                        }
                        updated = true
                    }
                    break
                
                // Word Valid
                case 3:
                    if (Players.isRegistered(letterScoreCurrentPlayer)) {
                        letterScoreValidSprites[letterScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        if (letterScoreValid[letterScoreCurrentPlayer]) {
                            music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                        } else {
                            music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
                        }
                        updated = true
                    }
                    break

                // Score
                case 4:
                    if (Players.isRegistered(letterScoreCurrentPlayer)) {
                        letterScoreSprites[letterScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, false)
                        updated = true
                    }
                    break
                
                // Register Scores
                case 5:
                    if (Players.isRegistered(letterScoreCurrentPlayer)) {
                        if (g_scoreMode.name[0] == "C") {
                            // Competitive scoring
                            if (letterScores[letterScoreCurrentPlayer] == letterHighScore) {
                                letterScoreSprites[letterScoreCurrentPlayer].setBorder(1, Color.White, 1)
                                music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                                Players.changeScoreBy(letterScoreCurrentPlayer, letterScores[letterScoreCurrentPlayer])
                            } else {
                                letterScoreSprites[letterScoreCurrentPlayer].setFlag(SpriteFlag.Invisible, true)
                                music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
                            }
                        } else {
                            // Friendly scoring
                            letterScoreSprites[letterScoreCurrentPlayer].setBorder(1, Color.White, 1)
                            music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                            Players.changeScoreBy(letterScoreCurrentPlayer, letterScores[letterScoreCurrentPlayer])
                        }
                        updated = true
                    }
                    break
                
                // Finish
                case 6:
                    showLetterScoreInstructions()
                    letterScoreCurrentPlayer = 99
                    updated = true
                    break
            }
            letterScoreCurrentPlayer++
            if (letterScoreCurrentPlayer > 4) {
                letterScoreCurrentPlayer = 1
                letterScoreCurrentColumn++
                if (letterScoreCurrentColumn > 6) {
                    updated = true
                    letterScoreUpdateDone = true
                }
            }
        }
    }

    export function updateLetterScoreDone(): boolean {
        return letterScoreUpdateDone
    }
}