/**
 * Methods for managing the letters round declarations board.
 * Requires microsoft/arcade-text and riknoll/arcade-fancy-text.
 */
namespace Countdown {
    const LETTER_BID_DIRECTIONS: string[] = [
        "Enter longest word length",
        "Arrow=change A=select",
    ]

    let wordBids: number[] = [0, 0, 0, 0, 0,]
    let wordBidFinalized: boolean[] = [false, false, false, false, false,]
    let wordBidSprites: TextSprite[] = [null, null, null, null, null,]

    export function allLettersDeclared(): boolean {
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p) && !wordBidFinalized[p]) {
                return false
            }
        }
        return true
    }

    export function beginLettersDeclare(puzzle: string): void {
        clearLetterBidBoard()
        wordBids = [0, 0, 0, 0, 0,]
        wordBidFinalized = [false, false, false, false, false,]
        wordBidSprites = [null, null, null, null, null,]
        let p: TextSprite = textsprite.create(puzzle, Color.Blue, Color.White)
        p.setKind(SpriteKind.LettersBoardDeclare)
        p.setBorder(1, Color.Aqua, 1)
        p.setMaxFontHeight(10)
        p.x = 80
        p.top = 0
        if (Players.isRegistered(1)) {
            drawWordBidPanel(0, 0, 1)
        }
        if (Players.isRegistered(2)) {
            drawWordBidPanel(80, 0, 2)
        }
        if (Players.isRegistered(3)) {
            drawWordBidPanel(0, 60, 3)
        }
        if (Players.isRegistered(4)) {
            drawWordBidPanel(80, 60, 4)
        }
        drawWordBidInstructions()
    }

    export function changeLettersBid(player: number, delta: number): void {
        if (
            player < 1 || player > 4 ||
            !Players.isRegistered(player) ||
            wordBidFinalized[player]
        ) {
            return
        }
        wordBids[player] += delta
        if (wordBids[player] < 3) {
            wordBids[player] = 9
        }
        if (wordBids[player] > 9) {
            wordBids[player] = 3
        }
        updateWordBidSprite(player)
    }

    export function clearLetterBidBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.LettersBoardDeclare)
    }

    function drawWordBidInstructions(): void {
        let x: number = 80
        let y: number = 105
        let ts: TextSprite = textsprite.create(
            LETTER_BID_DIRECTIONS[0], 0, 1
        )
        ts.setMaxFontHeight(5)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.LettersBoardDeclare)
        y += 7
        ts = textsprite.create(
            LETTER_BID_DIRECTIONS[1], 0, 1
        )
        ts.setMaxFontHeight(5)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.LettersBoardDeclare)
    }

    function drawWordBidPanel(left: number, top: number, player: number): void {
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
        wordBidSprites[player] = ts
        wordBids[player] = 3
        updateWordBidSprite(player)
    }

    export function finalizeLetterBid(player: number): void {
        if (player < 1 || player > 4) {
            return
        }
        wordBidFinalized[player] = true
        updateWordBidSprite(player)
    }

    export function getLetterBid(player: number): number {
        if (player < 1 || player > 4) {
            return -1
        }
        return wordBids[player]
    }

    function updateWordBidSprite(player: number): void {
        let accentColor: number = Players.accentColor(player)
        let s: TextSprite = wordBidSprites[player]
        s.setText(wordBids[player].toString())
        if (wordBidFinalized[player]) {
            s.fg = Color.Black
            s.bg = accentColor
        } else {
            s.fg = accentColor
            s.bg = Color.Transparent
        }
        s.update()
    }

    export function lettersDeclareTest(): void {
        wordBids = [0, 5, 6, 7, 9,]
        wordBidFinalized = [false, true, true, true, true,]
    }
}