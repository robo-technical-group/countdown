/**
 * Constants
 */
const LETTER_ROUND_INSTRUCTIONS: string = "A = Consonant, B = Vowel"
const LETTER_ROUND_NO_MORE_CONSONANTS: string = "\nSelect at least 3 vowels."
const LETTER_ROUND_NO_MORE_VOWELS: string = "\nSelect at least 4 consonants."
const TIMER_INSTRUCTIONS: string[] = [
    "Your 30 seconds",
    "start",
    "NOW."
]

/**
 * Global variables
 */
let g_currentRound: number = 0
let g_gameMode: number = SpriteKind.None
let g_gameType: GameType = null
let g_playerInControl: number = 0
let g_scoreMode: ScoreType = null
let g_timerInstructions: fancyText.TextSprite[] = []

/**
 * Functions
 */
function addConsonant(player: number): void {
    if (player != g_playerInControl || Countdown.getCurrLetter() == 9) {
        return
    }
    if (Countdown.getNumConsonants() == 6) {
        Countdown.showLetterInstructions(g_playerInControl, LETTER_ROUND_INSTRUCTIONS + LETTER_ROUND_NO_MORE_CONSONANTS)
        return
    }
    Countdown.addConsonant()
    showLettersPuzzle()
}

function addVowel(player: number): void {
    if (player != g_playerInControl || Countdown.getCurrLetter() == 9) {
        return
    }
    if (Countdown.getNumVowels() == 5) {
        Countdown.showLetterInstructions(g_playerInControl, LETTER_ROUND_INSTRUCTIONS + LETTER_ROUND_NO_MORE_VOWELS)
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

}

function beginLettersDeclare(): void {
    Tutorial.lettersRoundDeclare()
    Countdown.beginLettersDeclare(Countdown.getLetterPuzzle())
}

function beginLettersRound(): void {
    Countdown.startLettersRound()
    Countdown.initLettersBoard()
    Countdown.showLetterInstructions(g_playerInControl, LETTER_ROUND_INSTRUCTIONS)
    Tutorial.lettersRound()
}

function beginLettersSolve(): void {
    if (Players.numPlayers() > 1) {
        Countdown.clearLetterDeclareBoard()
        Countdown.beginLetterSolveMp()
        Tutorial.lettersRoundSolve()
    } else {
        // Single player will use letters board in solve mode.
    }
}

function beginNextRound(): void {
    switch (g_gameType.rounds[g_currentRound]) {
        case 'C':
            break
        
        case 'L':
            // Countdown.clearLettersBoard()
            break
        
        case 'N':
            break
    }

    g_currentRound++
    if (g_currentRound < g_gameType.rounds.length) {
        beginRound()
    } else {
        endGame()
    }
}

function beginNumbersRound(): void {

}

function beginRound(): void {
    g_gameMode = SpriteKind.None
    switch (g_gameType.rounds[g_currentRound]) {
        case 'C':
            beginConundrum()
            break
        
        case 'L':
            beginLettersRound()
            g_gameMode = SpriteKind.LettersBoard
            break
        
        case 'N':
            beginNumbersRound()
            break
    }
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

function showTimerInstruction(s: string, top: number): void {
    let f: fancyText.TextSprite = fancyText.create(
        s, null, Color.White, fancyText.bold_sans_7
    )
    f.x = 80
    f.top = top
    g_timerInstructions.push(f)
}

function startTimer(): number {
    let t: number = 0
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
                console.log("Solution: " + Countdown.getLetterSolution())
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
                console.log("All letters solutions finalized.")
            }
            break
    }
})

/**
 * Main
 */
// runIntro()
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
