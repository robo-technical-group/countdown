/**
 * Constants
 */
const CONUNDRUM_INSTRUCTIONS_FIRST: string = "Player "
const CONUNDRUM_INSTRUCTIONS_REST: string[] = [
    "A=Select B=Delete",
    "Enter nonsense word to exit"
]
const CONUNDRUM_INSTRUCTIONS_REVEALED: string[] = [
    "Player 1",
    "Press A to continue"
]
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
let g_conundrumFailed: boolean[] = [false, false, false, false, false,]
let g_conundrumReveal: string = ""
let g_conundrumRevealLetter: number = 0
let g_currentRandomization: number = 0
let g_currentRound: number = 0
let g_gameMode: number = SpriteKind.None
let g_gameType: GameType = null
let g_nextUpdate: number = 0
let g_playerInControl: number = 0
let g_scoreMode: ScoreType = null
let g_stopwatch: Stopwatch = null
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
    g_conundrumFailed = [false, false, false, false, false,]
    g_playerInControl = 0

    Countdown.generateConundrum()
    Countdown.initConundrumBoard()
    let t: number = UPDATE_INTERVAL * 2
    let puzzleWords: string[] = Countdown.getConundrumAsWords()
    timer.after(t, () => {
        Countdown.showConundrum(puzzleWords[0])
    })
    t += UPDATE_INTERVAL * 2
    timer.after(t, () => {
        Countdown.showConundrum(puzzleWords[0] + puzzleWords[1])
    })
    t += UPDATE_INTERVAL * 2
    if (puzzleWords.length > 2) {
        timer.after(t, () => {
            Countdown.showConundrum(Countdown.getConundrum())
        })
        t += UPDATE_INTERVAL * 2
    }
    timer.after(t, () => {
        Countdown.showConundrumInstructions()
        if (g_stopwatch == null) {
            g_stopwatch = new Stopwatch()
        }
        g_stopwatch.reset()
        g_stopwatch.update()
        g_stopwatch.x = 80
        g_stopwatch.y = 6
        g_stopwatch.start()
        g_stopwatch.setFlag(SpriteFlag.Invisible, false)
        g_gameMode = SpriteKind.ConundrumBoard
        Melodies.playMainTheme()
        console.log(`Solution: ${Countdown.getConundrumSolution()}`)
    })
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
    g_nextUpdate = 0
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
            g_stopwatch.reset()
            g_stopwatch.setFlag(SpriteFlag.Invisible, true)
            Countdown.clearConundrumBoard()
            break
        
        case 'L':
            Countdown.clearLettersScoreMp()
            break
        
        case 'N':
            Countdown.clearNumbersScoreMp()
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
    Countdown.startNumbersRound()
    Countdown.initNumbersBoard()
    Countdown.showNumberInstructions(g_playerInControl, NUMBERS_ROUND_INSTRUCTIONS)
    Tutorial.numbersRound()
}

function beginNumbersScore(): void {
    g_nextUpdate = 0
    Countdown.clearNumbersSolveMpBoard()
    Countdown.beginNumbersScoreMp()
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

function checkConundrum(): void {
    g_gameMode = SpriteKind.None
    let soln: string = Countdown.getConundrumSolution()
    let proposal: string = Countdown.getCurrConundrumSolution()
    if (soln == proposal || WordLists.isWordValid(proposal)) {
        music.play(music.melodyPlayable(music.magicWand), music.PlaybackMode.UntilDone)
        Players.changeScoreBy(g_playerInControl, 10)
        beginNextRound()
    } else {
        conundrumFail()
    }
}

function conundrumDeleteLetter(player: number): void {
    if (g_playerInControl != player && player != 1) {
        return
    }
    if (g_playerInControl == player) {
        Countdown.conundrumDeleteLast()
        return
    }
    if (player == 1 && g_playerInControl > 1) {
        // Kick current player out of conundrum
        conundrumFail()
        return
    }
    if (g_playerInControl == 0 && player == 1) {
        // End conundrum round
        if (Melodies.playing) {
            Melodies.stopAll()
        }
        Countdown.clearConundrumInstructions()
        g_conundrumReveal = Countdown.getConundrumSolution()
        g_stopwatch.reset()
        g_stopwatch.setFlag(SpriteFlag.Invisible, true)
        g_conundrumRevealLetter = 0
        g_nextUpdate = game.runtime() + UPDATE_INTERVAL * 2
        g_gameMode = SpriteKind.ConundrumReveal
        return
    }
}

function conundrumFail(): void {
    g_conundrumFailed[g_playerInControl] = true
    music.play(music.melodyPlayable(music.buzzer), music.PlaybackMode.InBackground)
    g_playerInControl = 0
    Countdown.hideConundrumSolution()
    g_stopwatch.start()
    Countdown.showConundrumInstructions()
    g_gameMode = SpriteKind.ConundrumBoard
}

function conundrumMove(player: number, delta: number): void {
    if (g_playerInControl != player) {
        return
    }
    Countdown.moveConundrumCursor(delta)
}

function conundrumRingIn(player: number): void {
    if (g_playerInControl > 0 && player != g_playerInControl) {
        return
    }
    if (player == g_playerInControl) {
        conundrumSelectLetter()
    } else {
        if (g_conundrumFailed[player]) {
            return
        }
        g_playerInControl = player
        g_stopwatch.stop()
        if (Melodies.playing) {
            Melodies.stopAll()
        }
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
        let instructions: string[] = []
        instructions.push(CONUNDRUM_INSTRUCTIONS_FIRST + player)
        for (let i of CONUNDRUM_INSTRUCTIONS_REST) {
            instructions.push(i)
        }
        Countdown.showConundrumInstructions(instructions)
        Countdown.enterConundrumSolution()
    }
}

function conundrumSelectLetter(): void {
    Countdown.conundrumAddSelected()
    if (Countdown.getCurrConundrumSolution().length == 9) {
        checkConundrum()
    }
}

function endGame(): void {
    game.splash("End of game!")
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
        
        case SpriteKind.NumbersBoardScore:
            if (!Countdown.updateNumberScoreDone() && game.runtime() > g_nextUpdate) {
                g_nextUpdate = game.runtime() + UPDATE_INTERVAL
                Countdown.updateNumbersScore()
            }
            break
        
        case SpriteKind.ConundrumReveal:
            if (
                g_conundrumRevealLetter < 9 &&
                game.runtime() >= g_nextUpdate
            ) {
                g_nextUpdate = game.runtime() + UPDATE_INTERVAL
                Countdown.showConundrumSolution(
                    g_conundrumReveal.substr(0, g_conundrumRevealLetter + 1))
                g_conundrumRevealLetter++
                if (g_conundrumRevealLetter > 8) {
                    Countdown.showConundrumInstructions(
                        CONUNDRUM_INSTRUCTIONS_REVEALED
                    )
                }
            }
            break
    }
    if (g_stopwatch != null && g_stopwatch.getState()) {
        g_stopwatch.update()
        g_stopwatch.x = 80
    }
})

/**
 * Main
 */
keymap.setSystemKeys(0, 0, 0, 0)
// runIntro()

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
