/**
 * Methods for managing the letters board.
 * Requires microsoft/arcade-text and riknoll/arcade-fancy-text.
 */
namespace Countdown {
    let letterTiles: TextSprite[] = []
    let lInstructionSprites: fancyText.TextSprite[] = []

    export function clearLettersBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.LettersBoard)
        letterTiles = []
        lInstructionSprites = []
    }

    export function clearLettersInstructions(): void {
        if (lInstructionSprites.length > 0) {
            for (let l of lInstructionSprites) {
                l.destroy()
            }
            lInstructionSprites = []
        }
    }

    export function initLettersBoard(): void {
        let x: number = 8
        let y: number = 20
        for (let i: number = 0; i < 9; i++) {
            let t: TextSprite = textsprite.create(" ", Color.Blue, Color.White)
            t.setBorder(1, Color.Aqua, 1)
            t.setMaxFontHeight(10)
            t.setPosition(x, y)
            t.setKind(SpriteKind.LettersBoard)
            x += 18
            letterTiles.push(t)
        }
    }

    function setLetter(location: number, letter: string): void {
        if (location < 0 || location > 8) {
            return
        }
        if (letterTiles.length == 0) {
            initLettersBoard()
        }
        letterTiles[location].setText(letter)
    }

    export function showLetterInstructions(player: number, instructions: string): void {
        clearLettersInstructions()
        let x: number = 80
        let bottom: number = 110
        let f1: fancyText.TextSprite = fancyText.create(instructions, null,
            Color.White, fancyText.bold_sans_7)
        f1.setKind(SpriteKind.LettersBoard)
        f1.x = x
        f1.bottom = bottom
        lInstructionSprites.push(f1)
        let f0: fancyText.TextSprite = fancyText.create("Player " + player, null,
            Color.White, fancyText.bold_sans_7
        )
        f0.setKind(SpriteKind.LettersBoard)
        f0.x = x
        f0.bottom = f1.top - 2
        lInstructionSprites.push(f0)
    }

    export function showLettersPuzzle(puzzle: string): void {
        for (let i: number = 0; i < puzzle.length; i++) {
            setLetter(i, puzzle[i])
        }
    }
}