/**
 * Tests
 */

/*
Players.register(2)
Players.register(1)
g_gameType = {
        name: "Quick Game",
        rounds: "LLNC",
        time: 10
}
g_currentRound = 0
g_playerInControl = 2
Tutorial.enable()
beginRound()
*/

/*
for (let i: number = 1; i < 5; i++) {
    if (i != 3) {
        Players.register(i)
    }
}
Countdown.lettersDeclareTest()
Countdown.letterSolveMpTest()
g_gameType = {
    name: "Quick Game",
    rounds: "LLNC",
    time: 10
}
g_scoreMode = {
    name: "Competitive",
    desc: "Whatever"
}
g_currentRound = 0
g_playerInControl = 2
Tutorial.enable()
g_gameMode = SpriteKind.None
Countdown.startLettersRound()
for (let c: number = 0; c < 5; c++) {
    Countdown.addConsonant()
}
for (let v: number = 0; v < 4; v++) {
    Countdown.addVowel()
}
Countdown.findLetterPuzzleSolution()
beginLettersScore()
g_gameMode = SpriteKind.LettersBoardScore
*/


/*
for (let i: number = 1; i < 5; i++) {
        Players.register(i)
    if (i != 3) {
    }
}
g_gameType = {
    name: "Quick Game",
    rounds: "LLNC",
    time: 10
}
g_scoreMode = {
    name: "Friendly",
    desc: "Whatever"
}
g_currentRound = 2
g_playerInControl = 2
Tutorial.enable()
g_gameMode = SpriteKind.None
Countdown.numbersRoundTest()
beginNumbersSolve()
g_gameMode = SpriteKind.NumbersBoardSolve
Countdown.startNumbersRound()
for (let b: number = 0; b < 2; b++) {
    Countdown.addBig()
}
for (let l: number = 0; l < 4; l++) {
    Countdown.addSmall()
}
Countdown.getRandomTarget()
Countdown.numbersDeclareTest()
Countdown.numberSolveMpTest()
console.log("Solving numbers puzzle.")
Countdown.solveNumbersRound()
console.log("Finished solving.")
beginNumbersScore()
g_gameMode = SpriteKind.NumbersBoardScore
*/
/*
Players.register(2)
Players.register(1)
g_gameType = {
    name: "Quick Game",
    rounds: "LLNC",
    time: 10
}
g_scoreMode = {
    name: "Friendly",
    desc: "Whatever"
}
g_currentRound = 2
g_playerInControl = 2
Tutorial.enable()
beginRound()
*/


/*
for (let i: number = 0; i < 10; i++) {
    Countdown.generateConundrum()
    let msg: string = Countdown.getConundrum() + " |"
    for (let w of Countdown.getConundrumAsWords()) {
        msg += " " + w
    }
    msg += " | " +
        Countdown.getConundrumSolution()
    console.log(msg)
    loops.pause(1000)
}
*/

/*
Countdown.generateConundrum()
for (let i: number = 1; i < 5; i++) {
        Players.register(i)
    if (i != 3) {
    }
}
g_gameType = {
    name: "Quick Game",
    rounds: "LLNC",
    time: 10
}
g_scoreMode = {
    name: "Friendly",
    desc: "Whatever"
}
g_currentRound = 3
g_playerInControl = 2
Tutorial.enable()
g_gameMode = SpriteKind.None
beginRound()
*/

/**
 * Timing tests.
game.stats = true
const TOTAL_NUM_TESTS: number = 20
let calculations: number[] = []
let currNumTest: number = 0
let numTests: number[] = []
let testBeginTime: number = 0
let testEndTime: number = 0
let testMode: number = 0
let testSprite: TextSprite = textsprite.create(" ", Color.Black, Color.Yellow)

function finishTest(testName: string): void {
    testEndTime = game.runtime()
    console.log(`${testName} end @ ${testEndTime} (${((testEndTime - testBeginTime) / 1000)} seconds.)`)
    testSprite.setText(`${testName} finished.`)
    testSprite.x = 80
}

function startNextNumberTest(): void {
    currNumTest++
    if (currNumTest > TOTAL_NUM_TESTS) {
        let sum: number = 0
        numTests.forEach((value: number, index: number) => {
            sum += value
        })
        console.log(`Average numbers solve: ${sum / TOTAL_NUM_TESTS / 1000} seconds.`)
        let totalCalculations: number = 0
        calculations.forEach((value: number, index: number) => {
            totalCalculations += value
        })
        console.log(`Average calculation count: ${(totalCalculations / TOTAL_NUM_TESTS) | 0}.`)
    } else {
        startNumberTest()
    }
}

function startNumberTests(): void {
    currNumTest = 0
    calculations = []
    numTests = []
    startNextNumberTest()
}

function startNumberTest(): void {
    Countdown.startNumbersRound()
    for (let i: number = 0; i < 2; i++) {
        Countdown.addBig()
    }
    for (let i: number = 0; i < 4; i++) {
        Countdown.addSmall()
    }
    startTest(`Numbers round ${currNumTest}`)
    Countdown.initNumbersRoundSolve()
    testMode = 2
}

function startTest(testName: string): void {
    testBeginTime = game.runtime()
    console.log(`${testName} start @ ${testBeginTime}.`)
    testSprite.setText(`${testName} started.`)
    testSprite.x = 80
}

function startWordLists(): void {
    startTest("Word list build")
    WordLists.startBuildingWordSets()
    testMode = 1
}

game.onUpdate(() => {
    switch (testMode) {
        case 1:
            if (WordLists.isReady()) {
                finishTest("Word list build")
                testMode = 0
                startNumberTests()
            } else if (!WordLists.isBuilding()) {
                WordLists.buildNextWordSet()
            }
            break
        
        case 2:
            if (Countdown.isNumbersSolved()) {
                finishTest("Numbers tests")
                console.log(`Calculations: ${Countdown.getCalculations()}`)
                testMode = 0
                calculations.push(Countdown.getCalculations())
                numTests.push(testEndTime - testBeginTime)
                startNextNumberTest()
            } else {
                Countdown.nextNumberSolveStep()
            }
  }
})

startWordLists()
 */
