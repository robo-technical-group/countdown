namespace Countdown {
    const DONE_TEXT: string = "Done"
    const LETTER_SOLVE_MP_INSTRUCTIONS = "A=Select B=Delete"

    let doneButtons: TextSprite[] = []
    let letterFinalized: boolean[] = []
    let letterSolutions: string[] = []
    let letterSolveTiles: TextSprite[][] = [[], [], [], [], [],]
    let selectedLetters: number[] = []
    let solnSprites: TextSprite[] = []

    export function allLettersSolved(): boolean {
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p) && !letterFinalized[p]) {
                return false
            }
        }
        return true
    }

    export function addLetterMp(player: number): void {
        let t: TextSprite = letterSolveTiles[player][selectedLetters[player]]
        if (t.fg != Color.Black) {
            t.fg = Color.Black
            t.update()
            letterSolutions[player] += t.text
            updateAnswerSpriteLetterMp(player)
        }
    }

    export function beginLetterSolveMp(): void {
        letterFinalized = [false, false, false, false, false,]
        letterSolutions = ["", "", "", "", "",]
        selectedLetters = [0, 0, 0, 0, 0,]
        clearLetterSolveMpBoard()
        if (Players.isRegistered(1)) {
            drawLetterSolvePanel(0, 0, 1)
        }
        if (Players.isRegistered(2)) {
            drawLetterSolvePanel(80, 0, 2)
        }
        if (Players.isRegistered(3)) {
            drawLetterSolvePanel(0, 60, 3)
        }
        if (Players.isRegistered(4)) {
            drawLetterSolvePanel(80, 60, 4)
        }
        drawLetterSolveMpInstructions()
    }

    export function clearLetterSolveMpBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.LettersBoardSolve)
        doneButtons = [null,null,null,null,null,]
        letterSolveTiles = [[], [], [], [], [],]
        solnSprites = [null,null,null,null,null,]
    }

    export function deleteLetterMp(player: number): void {
        if (letterFinalized[player] || letterSolutions[player].length == 0) {
            return
        }
        let accentColor: number = Players.accentColor(player)
        let deleted: string = letterSolutions[player].substr(-1)
        letterSolutions[player] =
            letterSolutions[player].substr(0, letterSolutions[player].length - 1)
        updateAnswerSpriteLetterMp(player)
        for (let t of letterSolveTiles[player]) {
            if (t.fg == Color.Black && t.text == deleted) {
                t.fg = accentColor
                t.update()
                break
            }
        }
    }

    function drawLetterSolveMpInstructions(): void {
        let i: TextSprite = textsprite.create(LETTER_SOLVE_MP_INSTRUCTIONS, 0, Color.White)
        i.bottom = 119
        i.x = 80
        i.setKind(SpriteKind.LettersBoardSolve)
    }

    function drawLetterSolvePanel(left: number, top: number, player: number): void {
        let puzzle: string = Countdown.getLetterPuzzle()
        let accentColor: number = Players.accentColor(player)

        let x: number = left + 40
        let y: number = top + 20
        let pft: fancyText.TextSprite = fancyText.create(
            `Player ${player} (${Countdown.getLetterBid(player)})`,
            null, accentColor, fancyText.bold_sans_7
        )
        pft.setPosition(x, y)
        pft.setKind(SpriteKind.LettersBoardSolve)

        y += 12
        let done: TextSprite = textsprite.create(DONE_TEXT, accentColor, Color.Black)
        done.setMaxFontHeight(5)
        done.setBorder(1, accentColor)
        done.setPosition(x, y)
        done.setKind(SpriteKind.LettersBoardSolve)
        doneButtons[player] = done

        x = left + 10
        y += 8
        for (let c of puzzle) {
            let ts: TextSprite = textsprite.create(c, Color.Black, accentColor)
            ts.setMaxFontHeight(8)
            ts.setBorder(1, Color.Black)
            ts.setPosition(x, y)
            ts.setKind(SpriteKind.LettersBoardSolve)
            letterSolveTiles[player].push(ts)
            x += 8
        }
        selectedLetters[player] = 0
        highlightLetterMp(player, selectedLetters[player], true)

        y += 10
        x = left + 40
        let soln: TextSprite = textsprite.create("", 0, accentColor)
        soln.setMaxFontHeight(8)
        soln.setPosition(x, y)
        soln.setKind(SpriteKind.LettersBoardSolve)
        solnSprites[player] = soln
        letterSolutions[player] = ""
        updateAnswerSpriteLetterMp(player)
    }

    function finalizeAnswer(player: number): void {
        letterFinalized[player] = true
        doneButtons[player].setFlag(SpriteFlag.Invisible, true)
        for (let t of letterSolveTiles[player]) {
            t.setFlag(SpriteFlag.Invisible, true)
        }
        solnSprites[player].setFlag(SpriteFlag.Invisible, true)
    }

    export function getPlayerLetterSolution(player: number): string {
        if (player < 1 || player > 4) {
            return ""
        }
        return letterSolutions[player]
    }

    function highlightDoneLetterMp(player: number, highlightOn: boolean): void {
        let accentColor: number = Players.accentColor(player)
        let d: TextSprite = doneButtons[player]
        d.borderColor = highlightOn ? Color.White : accentColor
        d.update()
    }

    function highlightLetterMp(player: number, index: number, highlightOn: boolean): void {
        let t: TextSprite = letterSolveTiles[player][index]
        t.borderColor = highlightOn ? Color.White : Color.Black
        t.update()
    }

    export function moveLetterCursorMp(player: number, hDelta: number, vDelta: number): void {
        if (letterFinalized[player]) {
            return
        }

        if (vDelta == 0) {
            highlightLetterMp(player, selectedLetters[player], false)
            selectedLetters[player] += hDelta
            if (selectedLetters[player] > 8) {
                selectedLetters[player] = 0
            }
            if (selectedLetters[player] < 0) {
                selectedLetters[player] = 8
            }
            highlightLetterMp(player, selectedLetters[player], true)
        } else {
            if (onDoneLetterMp(player)) {
                moveCursorMpToLetters(player)
            } else {
                moveCursorMpToDone(player)
            }
        }
    }

    function moveCursorMpToDone(player: number): void {
        highlightLetterMp(player, selectedLetters[player], false)
        highlightDoneLetterMp(player, true)
    }

    function moveCursorMpToLetters(player: number): void {
        highlightLetterMp(player, selectedLetters[player], true)
        highlightDoneLetterMp(player, false)
    }

    function onDoneLetterMp(player: number): boolean {
        let d: TextSprite = doneButtons[player]
        return d.borderColor == Color.White
    }

    export function selectLetterCursorMp(player: number): void {
        if (letterFinalized[player]) {
            return
        }
        if (onDoneLetterMp(player)) {
            finalizeAnswer(player)
        } else {
            addLetterMp(player)
        }
    }

    function updateAnswerSpriteLetterMp(player: number): void {
        let s: TextSprite = solnSprites[player]
        s.setText(letterSolutions[player])
        s.x = 40 + 80 * ((player + 1) % 2)
        s.update()
    }

    export function letterSolveMpTest(): void {
        letterFinalized = [false, true, true, true, true,]
        letterSolutions = ["", "CABIN", "WRAETH", "SKATING", "SPORTING",]
   }
}