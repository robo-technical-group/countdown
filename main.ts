/**
 * Constants
 */
const LETTERS_ROUND_INSTRUCTIONS: string = "A = Consonant, B = Vowel"
const LETTERS_ROUND_NO_MORE_CONSONANTS: string = "\nSelect at least 3 vowels."
const LETTERS_ROUND_NO_MORE_VOWELS: string = "\nSelect at least 4 consonants."
const NUMBERS_ROUND_INSTRUCTIONS: string = "A = Small, B = Big"
const NUMBERS_ROUND_NO_MORE_BIGS: string = "\nThere are only 4 big numbers."
const RANDOMIZATION_COUNT: number = 20
const RANDOMIZATION_DELAY: number = 100
const ROUND_NAME_CONUNDRUM: string = "Conundrum"
const ROUND_NAME_LETTERS: string = "Letters round"
const ROUND_NAME_NUMBERS: string = "Numbers round"
const TARGET_REVEAL_PAUSE: number = 500
const TIMER_INSTRUCTIONS: string[] = [
    "Your 30 seconds",
    "start",
    "NOW."
]
const UPDATE_INTERVAL: number = 750

/**
 * Global variables
 */
let g_currentRandomization: number = 0
let g_currentRound: number = 0
let g_gameMode: number = SpriteKind.None
let g_gameType: GameType = null
let g_nextUpdate: number = 0
let g_playerInControl: number = 0
let g_scoreMode: ScoreType = null
let g_timerInstructions: fancyText.TextSprite[] = []

/**
 * Functions
 */
function addBig(player: number): void {
    if (player != g_playerInControl || Countdown.getCurrNumber() == 6) {
        return
    }
    if (Countdown.getNumBigs() == 4) {
        Countdown.showNumberInstructions(g_playerInControl, NUMBERS_ROUND_INSTRUCTIONS + NUMBERS_ROUND_NO_MORE_BIGS)
        return
    }
    Countdown.addBig()
    showNumbersPuzzle()
}

function addConsonant(player: number): void {
    if (player != g_playerInControl || Countdown.getCurrLetter() == 9) {
        return
    }
    if (Countdown.getNumConsonants() == 6) {
        Countdown.showLetterInstructions(g_playerInControl, LETTERS_ROUND_INSTRUCTIONS + LETTERS_ROUND_NO_MORE_CONSONANTS)
        return
    }
    Countdown.addConsonant()
    showLettersPuzzle()
}

function addSmall(player: number): void {
    if (player != g_playerInControl || Countdown.getCurrNumber() == 6) {
        return
    }
    Countdown.addSmall()
    showNumbersPuzzle()
}

function addVowel(player: number): void {
    if (player != g_playerInControl || Countdown.getCurrLetter() == 9) {
        return
    }
    if (Countdown.getNumVowels() == 5) {
        Countdown.showLetterInstructions(g_playerInControl, LETTERS_ROUND_INSTRUCTIONS + LETTERS_ROUND_NO_MORE_VOWELS)
        return
    }
    Countdown.addVowel()
    showLettersPuzzle()
}

function begin(): void {
    color.clearFadeEffect()
    color.setPalette(color.Arcade)
    Tutorial.firstTutorial()
    Tutorial.welcome()
    Tutorial.firstRound()
    g_currentRound = 0
    g_playerInControl = Players.getRandomPlayer()
    beginRound()
}

function beginConundrum(): void {
    game.splash("STOP", "Conundrum not ready.")
}

function beginLettersDeclare(): void {
    Tutorial.lettersRoundDeclare()
    Countdown.beginLettersDeclare(Countdown.getLetterPuzzle())
}

function beginLettersRound(): void {
    Countdown.startLettersRound()
    Countdown.initLettersBoard()
    Countdown.showLetterInstructions(g_playerInControl, LETTERS_ROUND_INSTRUCTIONS)
    Tutorial.lettersRound()
}

function beginLettersScore(): void {
    Countdown.clearLetterSolveMpBoard()
    Countdown.beginLettersScoreMp()
    Tutorial.lettersRoundScore()
    if (g_scoreMode.name[0] == "C") {
        Tutorial.competitive()
    }
}

function beginLettersSolve(): void {
    if (Players.numPlayers() > 1) {
        Countdown.clearLetterBidBoard()
        Countdown.beginLetterSolveMp()
        Tutorial.lettersRoundSolve()
    } else {
        // Single player will use letters board in solve mode.
    }
}

function beginNextRound(): void {
    g_gameMode = SpriteKind.None
    switch (g_gameType.rounds[g_currentRound]) {
        case 'C':
            break
        
        case 'L':
            Countdown.clearLettersScoreMp()
            break
        
        case 'N':
            break
    }

    g_currentRound++
    g_playerInControl = Players.getNextPlayer(g_playerInControl)
    if (g_currentRound < g_gameType.rounds.length) {
        beginRound()
    } else {
        endGame()
    }
}

function beginNumbersDeclare(): void {
    Tutorial.numbersRoundDeclare()
    Countdown.beginNumbersDeclare(Countdown.getTarget())
}

function beginNumbersRound(): void {
    // game.splash("STOP","Numbers round not ready.")
    Countdown.startNumbersRound()
    Countdown.initNumbersBoard()
    Countdown.showNumberInstructions(g_playerInControl, NUMBERS_ROUND_INSTRUCTIONS)
    Tutorial.numbersRound()
}

function beginNumbersScore(): void {
    Countdown.clearNumbersSolveMpBoard()
    // Countdown.beginLettersScoreMp()
    Tutorial.numbersRoundScore()
    if (g_scoreMode.name[0] == "C") {
        Tutorial.competitive()
    }
}

function beginNumbersSolve(): void {
    if (Players.numPlayers() > 1) {
        Countdown.clearNumberDeclareBoard()
        Countdown.beginNumbersSolveMp()
        Tutorial.numbersRoundSolve()
    } else {
        // Single player will use numbers board in solve mode.
    }
}

function beginRound(): void {
    g_gameMode = SpriteKind.None
    let nextRound: () => void = null
    let roundType: string = ""
    
    switch (g_gameType.rounds[g_currentRound]) {
        case 'C':
            nextRound = () => {
                beginConundrum()
            }
            roundType = ROUND_NAME_CONUNDRUM
            break
        
        case 'L':
            nextRound = () => {
                beginLettersRound()
                g_gameMode = SpriteKind.LettersBoard
            }
            roundType = ROUND_NAME_LETTERS
            break
        
        case 'N':
            nextRound = () => {
                beginNumbersRound()
                g_gameMode = SpriteKind.NumbersBoard
            }
            roundType = ROUND_NAME_NUMBERS
            break
    }

    timer.after(0, () => {
        RoundSplash.beginSplash(g_currentRound + 1, roundType)
    })
    timer.after(5000, nextRound)
}

function endGame(): void {

}

function runIntro(): void {
    Intro.beginIntro()
    WordLists.startBuildingWordSets()
    g_gameMode = SpriteKind.Intro
}

function runSetup(): void {
    Setup.beginSetup()
    g_gameMode = SpriteKind.Setup
}

function runSplash(): void {
    RtgSplash.beginSplash()
    timer.after(2000, () => {
        Melodies.playMainTheme()
    })
    g_gameMode = SpriteKind.Splash
}

function showLettersPuzzle(): void {
    Countdown.showLettersPuzzle(Countdown.getLetterPuzzle())
    if (Countdown.getCurrLetter() == 9) {
        g_gameMode = SpriteKind.None
        Countdown.clearLettersInstructions()
        Tutorial.lettersRoundTimer()
        let delay: number = startTimer()
        timer.after(delay + 5000, () => {
            console.log("Looking for puzzle solution.")
            Countdown.findLetterPuzzleSolution()
            console.log("Solution found!")
            g_gameMode = SpriteKind.LettersBoardTimer
        })
    }
}

function showNumbersPuzzle(): void {
    Countdown.showNumbersPuzzle(Countdown.getNumberPuzzle())
    if (Countdown.getCurrNumber() == 6) {
        g_gameMode = SpriteKind.None
        Countdown.clearNumbersInstructions()
        startTargetRandomization()
    }
}

function showTimerInstruction(s: string, top: number): void {
    let f: fancyText.TextSprite = fancyText.create(
        s, null, Color.White, fancyText.bold_sans_7
    )
    f.x = 80
    f.top = top
    g_timerInstructions.push(f)
}

function startTargetRandomization(): void {
    g_currentRandomization = 0
    timer.after(500, updateTargetRandomization)
}

function startTimer(initPause: number = 0): number {
    let t: number = initPause
    timer.after(t, () => {
        showTimerInstruction(TIMER_INSTRUCTIONS[0], 60)
    })
    t += 1000
    timer.after(t, () => {
        showTimerInstruction(TIMER_INSTRUCTIONS[1], 68)
    })
    t += 1000
    timer.after(t, () => {
        showTimerInstruction(TIMER_INSTRUCTIONS[2], 76)
    })
    t += 1000
    timer.after(t, () => {
        for (let ti of g_timerInstructions) {
            ti.destroy()
        }
        g_timerInstructions = []
        info.startCountdown(30)
        Melodies.playTimer()
    })
    return t
}

function updateTargetRandomization(): void {
    let target: number = Countdown.getRandomTarget()
    Countdown.showTarget(target)
    g_currentRandomization++
    if (g_currentRandomization >= RANDOMIZATION_COUNT) {
        Tutorial.numbersRoundTimer()
        let delay: number = startTimer(TARGET_REVEAL_PAUSE)
        timer.after(delay + 5000, () => {
            console.log("Looking for puzzle solution.")
            Countdown.initNumbersRoundSolve()
            g_gameMode = SpriteKind.NumbersBoardTimer
        })
    } else {
        timer.after(RANDOMIZATION_DELAY, updateTargetRandomization)
    }
}

/**
 * Event handlers
 */
// Do not end the game at the end of a countdown timer.
info.onCountdownEnd(() => {})

game.onUpdate(() => {
    switch (g_gameMode) {
        case SpriteKind.Intro:
            if (WordLists.isReady()) {
                g_gameMode = SpriteKind.None
                Intro.endIntro()
                runSplash()
            } else if (!WordLists.isBuilding()) {
                Intro.update()
                WordLists.buildNextWordSet()
            }
            break
        
        case SpriteKind.Splash:
            if (!RtgSplash.isRunning()) {
                g_gameMode = SpriteKind.None
                RtgSplash.endSplash()
                runSetup()
            }
            break
        
        case SpriteKind.Setup:
            if (!Setup.isRunning() && !Melodies.playing()) {
                g_gameMode = SpriteKind.None
                Setup.endSetup()
                timer.after(1250, () => {
                    begin()
                })
            }
            break
        
        case SpriteKind.LettersBoardTimer:
            if (info.countdown() == 0 && !Melodies.playing()) {
                g_gameMode = SpriteKind.None
                // console.log("Solution: " + Countdown.getLetterSolution())
                if (Players.numPlayers() == 1) {
                } else {
                    Countdown.clearLettersBoard()
                    beginLettersDeclare()
                    g_gameMode = SpriteKind.LettersBoardDeclare
                }
            }
            break
        
        case SpriteKind.LettersBoardDeclare:
            if (Countdown.allLettersDeclared()) {
                g_gameMode = SpriteKind.None
                beginLettersSolve()
                g_gameMode = SpriteKind.LettersBoardSolve
            }
            break
        
        case SpriteKind.LettersBoardSolve:
            if (Countdown.allLettersSolved()) {
                g_gameMode = SpriteKind.None
                beginLettersScore()
                g_gameMode = SpriteKind.LettersBoardScore
            }
            break
        
        case SpriteKind.LettersBoardScore:
            if (!Countdown.updateLetterScoreDone() && game.runtime() > g_nextUpdate) {
                g_nextUpdate = game.runtime() + UPDATE_INTERVAL
                Countdown.updateLettersScore()
            }
            break
        
        case SpriteKind.NumbersBoardTimer:
            Countdown.nextNumberSolveStep()
            if (info.countdown() == 0 && !Melodies.playing()) {
                g_gameMode = SpriteKind.None
                console.log("Solution: " + Countdown.getNumbersSolution())
                if (Players.numPlayers() == 1) {
                } else {
                    Countdown.clearNumbersBoard()
                    beginNumbersDeclare()
                    g_gameMode = SpriteKind.NumbersBoardDeclare
                }
            }
            break
        
        case SpriteKind.NumbersBoardDeclare:
            if (Countdown.allNumbersDeclared()) {
                g_gameMode = SpriteKind.None
                beginNumbersSolve()
                g_gameMode = SpriteKind.NumbersBoardSolve
            }
            break
        
        case SpriteKind.NumbersBoardSolve:
            if (Countdown.allNumbersSolved()) {
                g_gameMode = SpriteKind.None
                beginNumbersScore()
                g_gameMode = SpriteKind.NumbersBoardScore
            }
            break
    }
})

/**
 * Main
 */
// runIntro()

for (let i: number = 1; i < 5; i++) {
        Players.register(i)
    if (i != 3) {
    }
}
Countdown.numbersDeclareTest()
g_gameType = {
    name: "Quick Game",
    rounds: "LLNC",
    time: 10
}
g_scoreMode = {
    name: "Competitive",
    desc: "Whatever"
}
g_currentRound = 2
g_playerInControl = 2
Tutorial.enable()
g_gameMode = SpriteKind.None
Countdown.numbersRoundTest()
/*
Countdown.startNumbersRound()
for (let b: number = 0; b < 2; b++) {
    Countdown.addBig()
}
for (let l: number = 0; l < 4; l++) {
    Countdown.addSmall()
}
Countdown.getRandomTarget()
console.log("Solving numbers puzzle.")
Countdown.solveNumbersRound()
console.log("Finished solving.")
*/
beginNumbersSolve()
g_gameMode = SpriteKind.NumbersBoardSolve