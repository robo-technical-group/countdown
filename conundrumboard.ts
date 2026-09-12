/**
 * Methods for managing the conundrum board.
 * Requires microsoft/arcade-text and riknoll/arcade-fancy-text.
 */
namespace Countdown {
    const CONUNDRUM_INSTRUCTIONS: string[] = [
        "Press A to solve.",
        "Player 1:",
        "Press B to end round."
    ]
    
    let conundrumTiles: TextSprite[] = []
    let currConundrumSolution: string = ""
    let conundrumSelectedTile: number = 0
    let conundrumSolutionTiles: TextSprite[] = []
    let cInstructionSprites: fancyText.TextSprite[] = []

    export function clearConundrumBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.ConundrumBoard)
        conundrumTiles = []
        conundrumSolutionTiles = []
        cInstructionSprites = []
    }

    export function clearConundrumInstructions(): void {
        if (cInstructionSprites.length > 0) {
            for (let l of cInstructionSprites) {
                l.destroy()
            }
            cInstructionSprites = []
        }
    }

    export function clearConundrumSolution(): void {
        currConundrumSolution = ""
        for (let t of conundrumSolutionTiles) {
            t.setText(" ")
        }
    }

    export function conundrumAddSelected(): void {
        let t: TextSprite = conundrumTiles[conundrumSelectedTile]
        if (t.fg != t.bg) {
            t.fg = t.bg
            t.update()
            currConundrumSolution += t.text
            showConundrumSolution(null)
        }
    }

    export function conundrumDeleteLast(): void {
        if (currConundrumSolution.length == 0) {
            return
        }
        let deleted: string = currConundrumSolution.substr(-1)
        currConundrumSolution = currConundrumSolution.substr(
            0, currConundrumSolution.length - 1
        )
        showConundrumSolution(null)
        for (let t of conundrumTiles) {
            if (t.fg == t.bg && t.text == deleted) {
                t.fg = Color.White
                t.update()
                break
            }
        }
    }

    export function enterConundrumSolution(): void {
        clearConundrumSolution()
        for (let t of conundrumSolutionTiles) {
            t.setFlag(SpriteFlag.Invisible, false)
        }
        for (let i: number = 0; i < 9; i++) {
            highlightConundrumTile(i, i == 0)
        }
        conundrumSelectedTile = 0
    }

    export function hideConundrumSolution(): void {
        for (let t of conundrumSolutionTiles) {
            t.setFlag(SpriteFlag.Invisible, true)
        }
        restoreConundrum()
    }

    export function initConundrumBoard(): void {
        clearConundrumBoard()
        currConundrumSolution = ""

        let x: number = 8
        let y: number = 30
        for (let i: number = 0; i < 9; i++) {
            let t: TextSprite = textsprite.create(" ", Color.Blue, Color.White)
            t.setBorder(1, Color.Aqua, 1)
            t.setMaxFontHeight(10)
            t.setPosition(x, y)
            t.setKind(SpriteKind.ConundrumBoard)
            x += 18
            conundrumTiles.push(t)
        }

        x = 8
        y += 25
        for (let i: number = 0; i < 9; i++) {
            let t: TextSprite = textsprite.create(" ", Color.Blue, Color.White)
            t.setBorder(1, Color.Aqua, 1)
            t.setMaxFontHeight(10)
            t.setPosition(x, y)
            t.setKind(SpriteKind.ConundrumBoard)
            t.setFlag(SpriteFlag.Invisible, true)
            x += 18
            conundrumSolutionTiles.push(t)
        }
    }

    export function getCurrConundrumSolution(): string {
        return currConundrumSolution
    }

    function highlightConundrumTile(index: number, highlightOn: boolean): void {
        let t: TextSprite = conundrumTiles[index]
        t.borderColor = highlightOn ? Color.Yellow : Color.Blue
        t.update()
    }

    export function moveConundrumCursor(delta: number): void {
        highlightConundrumTile(conundrumSelectedTile, false)
        conundrumSelectedTile += delta
        if (conundrumSelectedTile > 8) {
            conundrumSelectedTile = 0
        }
        if (conundrumSelectedTile < 0) {
            conundrumSelectedTile = 8
        }
        highlightConundrumTile(conundrumSelectedTile, true)
    }

    export function restoreConundrum(): void {
        for (let t of conundrumTiles) {
            t.fg = Color.White
            t.borderColor = Color.LightBlue
            t.update()
        }
    }

    function setConundrumLetter(location: number, letter: string): void {
        if (location < 0 || location > 8) {
            return
        }
        if (conundrumTiles.length == 0) {
            initConundrumBoard()
        }
        conundrumTiles[location].setText(letter)
    }

    function setConundrunSolutionLetter(location: number, letter: string): void {
        if (location < 0 || location > 8) {
            return
        }
        if (conundrumSolutionTiles.length == 0) {
            initConundrumBoard()
        }
        conundrumSolutionTiles[location].setText(letter)
        conundrumSolutionTiles[location].setFlag(SpriteFlag.Invisible, false)
    }

    export function showConundrumInstructions(instructions: string[] = null): void {
        clearConundrumInstructions()
        let x: number = 80
        let bottom: number = 110
        if (instructions == null) {
            instructions = CONUNDRUM_INSTRUCTIONS
        }
        for (let i: number = instructions.length - 1; i > -1; i--) {
            let f: fancyText.TextSprite = fancyText.create(
                instructions[i],
                null,
                Color.White, fancyText.bold_sans_7)
            f.setKind(SpriteKind.ConundrumBoard)
            f.x = x
            f.bottom = bottom
            cInstructionSprites.push(f)
            bottom -= 10
        }
    }

    export function showConundrum(puzzle: string): void {
        for (let i: number = 0; i < puzzle.length; i++) {
            setConundrumLetter(i, puzzle[i])
        }
    }

    export function showConundrumSolution(solution: string | null): void {
        if (solution != null) {
            currConundrumSolution = solution
        }
        for (let i: number = 0; i < currConundrumSolution.length; i++) {
            setConundrunSolutionLetter(i, currConundrumSolution[i])
        }
        for (let i: number = currConundrumSolution.length; i < 9; i++) {
            setConundrunSolutionLetter(i, " ")
        }
    }
}