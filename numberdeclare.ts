/**
 * Methods for managing the numbers round declarations board.
 * Requires microsoft/arcade-text and riknoll/arcade-fancy-text.
 */
namespace Countdown {
    const NUMBER_BID_INSTRUCTIONS: string[] = [
        "Enter closest solution",
        "Arrow=change, A=select",
    ]

    let numberDeclared: boolean[] = [false, false, false, false, false,]
    let numberSolutions: number[] = [0, 0, 0, 0, 0,]
    let numberSolnSprites: TextSprite[] = []
    let target: number = 0

    export function allNumbersDeclared(): boolean {
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p) && !numberDeclared[p]) {
                return false
            }
        }
        return true
    }

    export function beginNumbersDeclare(puzzle: number): void {
        target = puzzle
        clearNumberDeclareBoard()
        numberDeclared = [false, false, false, false, false,]
        numberSolutions = [0, 0, 0, 0, 0,]
        numberSolnSprites = [null, null, null, null, null,]
        let p: TextSprite = textsprite.create(puzzle.toString(), Color.Blue, Color.White)
        p.setKind(SpriteKind.NumbersBoardDeclare)
        p.setBorder(1, Color.Aqua, 1)
        p.setMaxFontHeight(10)
        p.x = 80
        p.top = 0
        if (Players.isRegistered(1)) {
            drawNumberSolnPanel(0, 0, 1)
        }
        if (Players.isRegistered(2)) {
            drawNumberSolnPanel(80, 0, 2)
        }
        if (Players.isRegistered(3)) {
            drawNumberSolnPanel(0, 60, 3)
        }
        if (Players.isRegistered(4)) {
            drawNumberSolnPanel(80, 60, 4)
        }
        drawNumbersBidInstructions()
    }

    export function changeNumberBid(player: number, delta: number): void {
        if (
            player < 1 || player > 4 ||
            !Players.isRegistered(player) ||
            numberDeclared[player]
        ) {
            return
        }
        numberSolutions[player] += delta
        if (numberSolutions[player] < target - 11) {
            numberSolutions[player] = target + 10
        }
        if (numberSolutions[player] > target + 11) {
            numberSolutions[player] = target - 10
        }
        updateNumberSolnSprite(player)
    }

    export function clearNumberDeclareBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.NumbersBoardDeclare)
    }

    function drawNumbersBidInstructions(): void {
        let x: number = 80
        let y: number = 105
        let ts: TextSprite = textsprite.create(
            NUMBER_BID_INSTRUCTIONS[0], 0, 1
        )
        ts.setMaxFontHeight(5)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.NumbersBoardDeclare)
        y += 7
        ts = textsprite.create(
            NUMBER_BID_INSTRUCTIONS[1], 0, 1
        )
        ts.setMaxFontHeight(5)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.NumbersBoardDeclare)
    }

    function drawNumberSolnPanel(left: number, top: number, player: number): void {
        let accentColor: number = Players.accentColor(player)
        let x: number = left + 40
        let y: number = top + 20
        let pft: fancyText.TextSprite = fancyText.create(`Player ${player}`,
            null, accentColor, fancyText.bold_sans_7
        )
        pft.setPosition(x, y)
        pft.setKind(SpriteKind.NumbersBoardDeclare)
        y += 15
        let ts: TextSprite = textsprite.create("   ", 0, accentColor)
        ts.padding = 2
        ts.setMaxFontHeight(12)
        ts.setPosition(x, y)
        ts.setKind(SpriteKind.NumbersBoardDeclare)
        numberSolnSprites[player] = ts
        numberSolutions[player] = target
        updateNumberSolnSprite(player)
    }

    export function finalizeNumberBid(player: number): void {
        if (player < 1 || player > 4) {
            return
        }
        numberDeclared[player] = true
        updateNumberSolnSprite(player)
    }

    export function getNumbersBid(player: number): number {
        if (player < 1 || player > 4) {
            return -1
        }
        return numberSolutions[player]
    }

    function updateNumberSolnSprite(player: number): void {
        let accentColor: number = Players.accentColor(player)
        let n: TextSprite = numberSolnSprites[player]
        n.setText(
            Math.abs(target - numberSolutions[player]) > 10 ?
            "Miss" :
            numberSolutions[player].toString()
        )
        if (numberDeclared[player]) {
            n.fg = Color.Black
            n.bg = accentColor
        } else {
            n.fg = accentColor
            n.bg = Color.Transparent
        }
        n.update()
    }

    export function numbersDeclareTest(): void {
        // numberSolutions = [0, 790, 791, 792, 793,]
        numberSolutions = [0, 790, 791, 0, 0,]
        numberDeclared = [false, true, true, true, true,]
    }
}