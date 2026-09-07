/**
 * Methods for managing the letters round declarations board.
 * Requires microsoft/arcade-text and riknoll/arcade-fancy-text.
 */
namespace Countdown {
    const DIRECTIONS: string[] = [
        "Enter longest word length",
        "Arrow=change A=select",
    ]

    let wordLengths: number[] = []
    let wordLengthFinalized: boolean[] = []
    let wordLengthSprites: TextSprite[] = []

    export function allLettersDeclared(): boolean {
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p) && !wordLengthFinalized[p]) {
                return false
            }
        }
        return true
    }

    export function beginLettersDeclare(puzzle: string): void {
        clearLetterDeclareBoard()
        wordLengths = [0, 0, 0, 0, 0,]
        wordLengthFinalized = [false, false, false, false, false,]
        wordLengthSprites = [null, null, null, null, null,]
        let p: TextSprite = textsprite.create(puzzle, Color.Blue, Color.White)
        p.setKind(SpriteKind.LettersBoardDeclare)
        p.setBorder(1, Color.Aqua, 1)
        p.setMaxFontHeight(10)
        p.x = 80
        p.top = 0
        if (Players.isRegistered(1)) {
            drawWordLengthPanel(0, 0, 1)
        }
        if (Players.isRegistered(2)) {
            drawWordLengthPanel(80, 0, 2)
        }
        if (Players.isRegistered(3)) {
            drawWordLengthPanel(0, 60, 3)
        }
        if (Players.isRegistered(4)) {
            drawWordLengthPanel(80, 60, 4)
        }
        drawWordLengthInstructions()
    }

    export function changeLetterDeclaration(player: number, delta: number): void {
        if (
            player < 1 || player > 4 ||
            !Players.isRegistered(player) ||
            wordLengthFinalized[player]
        ) {
            return
        }
        wordLengths[player] += delta
        if (wordLengths[player] < 3) {
            wordLengths[player] = 9
        }
        if (wordLengths[player] > 9) {
            wordLengths[player] = 3
        }
        updateWordLengthSprite(player)
    }

    export function clearLetterDeclareBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.LettersBoardDeclare)
    }

    function drawWordLengthInstructions(): void {
        let x: number = 80
        let y: number = 110
        let ts: TextSprite = textsprite.create(
            DIRECTIONS[0], 0, 1
        )
        ts.setMaxFontHeight(5)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.LettersBoardDeclare)
        y += 7
        ts = textsprite.create(
            DIRECTIONS[1], 0, 1
        )
        ts.setMaxFontHeight(5)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.LettersBoardDeclare)
    }

    function drawWordLengthPanel(left: number, top: number, player: number): void {
        let accentColor: number = Players.accentColor(player)
        let x: number = left + 40
        let y: number = top + 20
        let pft: fancyText.TextSprite = fancyText.create(`Player ${player}`,
            null, accentColor, fancyText.bold_sans_7
        )
        pft.setPosition(x, y)
        pft.setKind(SpriteKind.LettersBoardDeclare)
        y += 15
        let ts: TextSprite = textsprite.create(" ", 0, accentColor)
        ts.padding = 2
        ts.setMaxFontHeight(12)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.LettersBoardDeclare)
        wordLengthSprites[player] = ts
        wordLengths[player] = 3
        updateWordLengthSprite(player)
    }

    export function finalizeLetterDeclaration(player: number): void {
        if (player < 1 || player > 4) {
            return
        }
        wordLengthFinalized[player] = true
        updateWordLengthSprite(player)
    }

    export function getLetterDeclaration(player: number): number {
        if (player < 1 || player > 4) {
            return -1
        }
        return wordLengths[player]
    }

    export function getPlayerBid(player: number): number {
        if (player < 1 || player > 4) {
            return -1
        }
        return wordLengths[player]
    }

    function updateWordLengthSprite(player: number): void {
        let accentColor: number = Players.accentColor(player)
        let s: TextSprite = wordLengthSprites[player]
        s.setText(wordLengths[player].toString())
        if (wordLengthFinalized[player]) {
            s.fg = Color.Black
            s.bg = accentColor
        } else {
            s.fg = accentColor
            s.bg = Color.Transparent
        }
        s.update()
    }

    export function lettersDeclareTest(): void {
        wordLengths = [0, 5, 6, 7, 9,]
        wordLengthFinalized = [false, true, true, true, true,]
    }
}