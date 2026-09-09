/**
 * Methods for managing the numbers board.
 * Requires microsoft/arcade-text and riknoll/arcade-fancy-text.
 */
namespace Countdown {
    let nInstructionSprites: fancyText.TextSprite[] = []
    let numberTiles: TextSprite[] = []
    let targetTile: TextSprite = null

    export function clearNumbersBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.NumbersBoard)
        nInstructionSprites = []
        numberTiles = []
    }

    export function clearNumbersInstructions(): void {
        if (nInstructionSprites.length > 0) {
            for (let n of nInstructionSprites) {
                n.destroy()
            }
            nInstructionSprites = []
        }
    }

    export function initNumbersBoard(): void {
        targetTile = textsprite.create("   ", Color.Blue, Color.White)
        targetTile.maxFontHeight = 12
        targetTile.setBorder(1, Color.Aqua, 2)
        targetTile.setPosition(80, 20)
        targetTile.setKind(SpriteKind.NumbersBoard)

        let x: number = 17
        let y: number = 40
        numberTiles = []
        for (let i: number = 0; i < 6; i++) {
            let tile: TextSprite = textsprite.create("   ", Color.Blue, Color.White)
            tile.setBorder(1, Color.Aqua, 1)
            tile.setPosition(x, y)
            tile.setKind(SpriteKind.NumbersBoard)
            numberTiles.push(tile)
            x += 25
        }
    }

    export function showNumberInstructions(player: number, instructions: string): void {
        clearNumbersInstructions()
        let x: number = 80
        let bottom: number = 110
        let f1: fancyText.TextSprite = fancyText.create(instructions, null,
            Color.White, fancyText.bold_sans_7)
        f1.setKind(SpriteKind.NumbersBoard)
        f1.x = x
        f1.bottom = bottom
        nInstructionSprites.push(f1)
        let f0: fancyText.TextSprite = fancyText.create("Player " + player, null,
            Color.White, fancyText.bold_sans_7
        )
        f0.setKind(SpriteKind.NumbersBoard)
        f0.x = x
        f0.bottom = f1.top - 2
        nInstructionSprites.push(f0)
    }

    export function showNumbersPuzzle(puzzle: number[]): void {
        for (let i: number = 0; i < 6; i++) {
            if (puzzle[i] > 0) {
                let t: string = puzzle[i].toString()
                switch (t.length) {
                    case 1:
                        t = " " + t + " "
                        break
                    
                    case 2:
                        t = " " + t
                        break
                }
                numberTiles[i].setText(t)
            }
        }
    }

    export function showTarget(target: number): void {
        if (target > 99) {
            targetTile.setText(target.toString())
        } else {
            targetTile.setText("   ")
        }
    }
}