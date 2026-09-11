namespace Countdown {
    enum NumberRoundLocation {
        LeftNumber,
        Operator,
        RightNumber,
    }

    interface Calculation {
        lhs: number
        op: number
        rhs: number
    }

    const NUMBER_SOLVE_MP_INSTRUCTIONS = "Choose = when done"
    const OPERATIONS: string[] = ["+", "-", "x", "/", "="]

    let currCalcSprites: fancyText.TextSprite[] = []
    let currCalculations: Calculation[] = []
    let currLocations: NumberRoundLocation[] = []
    let numberSolutions: number[] = []
    let numberSolveSprites: TextSprite[][] = []
    let operationsSprites: TextSprite[][] = []
    let selectedNumbers: number[] = []
    let selectedOperations: number[] = []

    export function allNumbersSolved(): boolean {
        for (let p: number = 1; p < 5; p++) {
            if (Players.isRegistered(p) && numberSolutions[p] == -1) {
                return false
            }
        }
        return true
    }

    export function beginNumbersSolveMp(): void {
        currCalculations = [null, null, null, null, null,]
        currLocations = [0, 0, 0, 0, 0,]
        numberSolutions = [0, -1, -1, -1, -1,]
        selectedNumbers = [0, 0, 0, 0, 0,]
        selectedOperations = [0, 0, 0, 0, 0,]
        clearNumbersSolveMpBoard()
        if (Players.isRegistered(1)) {
            drawNumbersSolvePanel(0, 0, 1)
        }
        if (Players.isRegistered(2)) {
            drawNumbersSolvePanel(80, 0, 2)
        }
        if (Players.isRegistered(3)) {
            drawNumbersSolvePanel(0, 55, 3)
        }
        if (Players.isRegistered(4)) {
            drawNumbersSolvePanel(80, 55, 4)
        }
        drawNumberSolveMpInstructions()
    }

    export function clearNumbersSolveMpBoard(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.NumbersBoardSolve)
        currCalcSprites = [null, null, null, null, null,]
        numberSolveSprites = [[], [], [], [], [],]
        operationsSprites = [[], [], [], [], [],]
    }

    function drawNumberSolveMpInstructions(): void {
        let i: TextSprite = textsprite.create(NUMBER_SOLVE_MP_INSTRUCTIONS, 0, Color.White)
        i.bottom = 119
        i.x = 80
        i.setKind(SpriteKind.NumbersBoardSolve)
    }

    function drawNumbersSolvePanel(left: number, top: number, player: number): void {
        let bid: number = Countdown.getNumbersBid(player)
        let target: number = Countdown.getTarget()
        let accentColor: number = Players.accentColor(player)

        let calc: Calculation = {
            lhs: -1,
            op: -1,
            rhs: -1,
        }
        currCalculations[player] = calc

        let x: number = left + 40
        let y: number = top + 15
        let pft: fancyText.TextSprite = fancyText.create(
            `Player ${player} (${Math.abs(bid - target) > 10 ? "Miss" : bid})`,
            null, accentColor, fancyText.bold_sans_7
        )
        pft.setPosition(x, y)
        pft.setKind(SpriteKind.NumbersBoardSolve)

        if (Math.abs(bid - target) > 10) {
            numberSolutions[player] = 0
            return
        }
        x = left + 40
        y += 10
        let c: fancyText.TextSprite = fancyText.create(
            " ",
            null, accentColor, fancyText.bold_sans_7
        )
        c.y = y
        c.setKind(SpriteKind.NumbersBoardSolve)
        currCalcSprites[player] = c
        updateCurrCalcSprite(player)

        x = left + 15
        y += 10
        operationsSprites[player] = []
        for (let o of OPERATIONS) {
            let s: TextSprite = textsprite.create(
                o, Color.Black, accentColor
            )
            s.setMaxFontHeight(5)
            s.setBorder(1, Color.Black)
            s.left = x
            s.y = y
            s.setKind(SpriteKind.NumbersBoardSolve)
            operationsSprites[player].push(s)
            x += 10
        }

        x = left
        y += 8
        numberSolveSprites[player] = []
        let p: number[] = Countdown.getNumberPuzzle()
        for (let i: number = 0; i < p.length; i++) {
            let n: number = p[i]
            let s: TextSprite = textsprite.create(
                numToString(n), Color.Black, accentColor
            )
            s.setMaxFontHeight(5)
            s.setBorder(1, Color.Black)
            s.left = x
            s.y = y
            s.setKind(SpriteKind.NumbersBoardSolve)
            numberSolveSprites[player].push(s)
            if (i == 0) {
                highlightNumberSolveSprite(s, true)
            }
            if (i == 2) {
                x = left
                y += 8
            } else {
                x += s.width + 1
            }
        }
    }

    function finalizeSolution(player: number, solution: number): void {
        numberSolutions[player] = solution
        currCalculations[player].lhs = solution
        currCalculations[player].op = -1
        updateCurrCalcSprite(player)
        for (let n of numberSolveSprites[player]) {
            n.setFlag(SpriteFlag.Invisible, true)
        }
        for (let o of operationsSprites[player]) {
            o.setFlag(SpriteFlag.Invisible, true)
        }
    }

    function highlightNumberSolveSprite(ts: TextSprite, highlightOn: boolean): void {
        ts.borderColor =
            highlightOn ? Color.White : Color.Black
        ts.update()
    }

    export function moveNumberCursorMp(player: number, hDelta: number, vDelta: number): void {
        let currLocation: NumberRoundLocation = currLocations[player]
        if (vDelta != 0) {
            if (currLocation == NumberRoundLocation.Operator) {
                hDelta = vDelta
            } else {
                hDelta = vDelta * 3
            }
        }

        switch (currLocation) {
            case NumberRoundLocation.LeftNumber:
            case NumberRoundLocation.RightNumber:
                moveNumbersCursor(player, hDelta)
                break
            
            case NumberRoundLocation.Operator:
                moveOpsCursor(player, hDelta)
                break
        }
    }

    function moveNumbersCursor(player: number, delta: number): void {
        let sel: number = selectedNumbers[player]
        let ts: TextSprite = numberSolveSprites[player][sel]
        let len: number = numberSolveSprites[player].length
        highlightNumberSolveSprite(ts, false)
        sel += delta

        while (sel < 0) {
            sel += len
        }
        while (sel > len - 1) {
            sel -= len
        }
        selectedNumbers[player] = sel
        ts = numberSolveSprites[player][sel]
        highlightNumberSolveSprite(ts, true)
    }

    function moveOpsCursor(player: number, delta: number): void {
        let sel: number = selectedOperations[player]
        let ts: TextSprite = operationsSprites[player][sel]
        let len: number = operationsSprites[player].length
        highlightNumberSolveSprite(ts, false)
        sel += delta

        while (sel < 0) {
            sel += len
        }
        while (sel > len - 1) {
            sel -= len
        }
        selectedOperations[player] = sel
        ts = operationsSprites[player][sel]
        highlightNumberSolveSprite(ts, true)
    }

    function moveToNumbers(player: number): void {
        let n: TextSprite = numberSolveSprites[player][selectedNumbers[player]]
        let o: TextSprite = operationsSprites[player][selectedOperations[player]]
        highlightNumberSolveSprite(n, true)
        highlightNumberSolveSprite(o, false)
    }

    function moveToOps(player: number): void {
        let n: TextSprite = numberSolveSprites[player][selectedNumbers[player]]
        let o: TextSprite = operationsSprites[player][selectedOperations[player]]
        highlightNumberSolveSprite(n, false)
        highlightNumberSolveSprite(o, true)
    }

    function numToString(n: number): string {
        let t: string = n.toString()
        switch (t.length) {
            case 1:
                t = "  " + t + " "
                break
            
            case 2:
                t = " " + t + " "
                break
            
            case 3:
                t += " "
                break
        }
        return t
    }

    export function selectNumberCursorMp(player: number): void {
        let ts: TextSprite = null
        let currLocation: NumberRoundLocation = currLocations[player]
        let currCalc: Calculation = currCalculations[player]
        switch (currLocation) {
            case NumberRoundLocation.LeftNumber:
                ts = numberSolveSprites[player][selectedNumbers[player]]
                if (ts.fg != ts.bg) {
                    currCalc.lhs = parseInt(ts.text)
                    updateCurrCalcSprite(player)
                    ts.fg = ts.bg
                    moveToOps(player)
                    currLocations[player] = NumberRoundLocation.Operator
                }
                break
            
            case NumberRoundLocation.Operator:
                if (selectedOperations[player] == 4) {
                    finalizeSolution(player, currCalc.lhs)
                } else {
                    currCalc.op = selectedOperations[player]
                    updateCurrCalcSprite(player)
                    moveToNumbers(player)
                    currLocations[player] = NumberRoundLocation.RightNumber
                }
                break
            
            case NumberRoundLocation.RightNumber:
                ts = numberSolveSprites[player][selectedNumbers[player]]
                if (ts.fg != ts.bg) {
                    currCalc.rhs = parseInt(ts.text)
                }
                let calc: number = 0
                switch (currCalc.op) {
                    case 0:
                        calc = currCalc.lhs + currCalc.rhs
                        break
                    
                    case 1:
                        calc = currCalc.lhs - currCalc.rhs
                        break
                    
                    case 2:
                        calc = currCalc.lhs * currCalc.rhs
                        break
                    
                    case 3:
                        calc = currCalc.lhs / currCalc.rhs
                        break
                }
                if (calc < 0 || (calc | 0) != calc) {
                    music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
                    finalizeSolution(player, 0)
                } else if (calc == Countdown.getNumbersBid(player)) {
                    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
                    finalizeSolution(player, calc)
                } else {
                    ts.setText(numToString(calc))
                    currCalc.lhs = currCalc.op = currCalc.rhs = -1
                    updateCurrCalcSprite(player)
                    currLocations[player] = NumberRoundLocation.LeftNumber
                }
                break
        }
    }

    function updateCurrCalcSprite(player: number): void {
        let t: string = ""
        let calc: Calculation = currCalculations[player]
        if (calc.lhs > -1) {
            t += calc.lhs.toString()
        }
        if (calc.op > -1) {
            t += " " + OPERATIONS[calc.op]
        }
        let f: fancyText.TextSprite = currCalcSprites[player]
        f.setText(t)
        f.x = 40 + 80 * ((player + 1) % 2)
    }
}