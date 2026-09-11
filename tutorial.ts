namespace Tutorial {
    enum Tutorial {
        Enabled = 0,
        First,
        Welcome,
        FirstRound,
        FirstLettersA,
        FirstLettersB,
        FirstLettersC,
        FirstLettersD,
        FirstLettersE,
        FirstLettersTimer,
        FirstLettersDeclare,
        FirstLettersSolve,
        FirstLettersScore,
        FirstCompetitive,
        FirstNumbersA,
        FirstNumbersB,
        FirstNumbersC,
        FirstNumbersD,
        FirstNumbersE,
        FirstNumbersF,
        FirstNumbersTimerA,
        FirstNumbersTimerB,
        FirstNumbersTimerC,
        FirstNumbersTimerD,
        FirstNumbersDeclare,
        FirstNumbersSolveA,
        FirstNumbersSolveB,
        FirstNumbersScore,
        FirstConundrum,
        Last // Used for counting; keep as last item.
    }

    const ASK: string[] = [
        'Enable tutorials?',
        'A = Yes, B = No',
    ]
    const GAME_NAME: string = 'Countdown'
    const INTRO: string = 'Welcome to ' + GAME_NAME + '!'
    const PERSIST_KEY_PREFIX: string = 'TUTORIAL_PERSIST_'
    const TEXT: string[] = [
        // Enabled: Player 1 reminder.
        'Player 1: Remember that you are in control of the tutorials.\n \n' +
        'Player 1, press A to continue.',

        // First
        'TUTORIAL MODE ENABLED\n \nPlayer 1 should read the tutorials aloud to the other players.\n \n' +
        'Player 1 controls the tutorials. Player 1, press your A button to continue. \n \n' +
        'You can enable and disable the tutorials from the system menu by selecting the Menu button.',

        // Welcome
        'Welcome to ' + GAME_NAME + '!\n \n' + GAME_NAME + ' is played over a series of rounds.\n' +
        'Some of the rounds, like this first one, will be LETTERS rounds. Others will be ' +
        'NUMBER rounds. The last round is always the CONUNDRUM.\n \n' +
        'You will learn about each round as you encounter them.',

        // First round
        'Control for the first round is randomly assigned. ' +
        'After the first round, control is passed to each player in turn.',

        // First Letters A
        'Welcome to the letters round!\n \n' +
        'You will create a puzzle board and then look for the longest word.',

        // First Letters B
        "At the top of the screen is the letter board. Right now, it's empty.\n \n" +
        'The player in control will create the puzzle.',

        // First Letters C
        'Instructions to build the puzzle are at the bottom of the screen. ' +
        'The player in control will create the puzzle one letter at a time. ' +
        'Press A to add a consonant and B to add a vowel. ',

        // First Letters D
        'When adding a letter, the game rules require you to say ' +
        'CONSONANT or VOWEL out loud. Also, since there is no host, ' +
        'you must say the letter out loud when it is revealed./j',

        // First Letters E
        'Time to build your first letters puzzle!',

        // First Letters Timer
        'You now have 30 seconds to find the longest word that you can! ' +
        'Words must be at least 3 letters long, spelled correctly, ' +
        'and found in a U.S. dictionary. ' +
        "Rude words have been removed from the game's dictionary. " +
        'Good luck!',

        // First Letters Declare
        "How did you do? Let's find out!\n \n" +
        'Now, you must declare your bid. ' +
        'Enter the length of the longest word that you found. ' +
        'Use the arrows to change your response. ' +
        'Press A to lock in your bid. ' +
        'When you lock your bid, it will highlight ' +
        'and you will not be able to change it.\n \n' +
        'Lock in your bids now!',

        // First Letters Solve
        "It's time to enter your solution!\n \n" +
        'Move the cursor with your D-pad. ' +
        'Use A to select and B to delete the last letter. ' +
        'Move the cursor to DONE when finished.\n \n' +
        'As a reminder, your bid appears in parentheses. ' +
        'Make sure your word length matches your bid!',

        // First Letters Score
        "Now, let's score your solutions! " +
        'If your solution is valid, you earn one point ' +
        'per letter in your word. If you made a 9-letter ' +
        'word, then you get an extra 10 points!',

        // First Competitive
        'Because you are playing in competitive mode, ' +
        'only the highest score(s) count each round!',

        // First Numbers A
        'Welcome to the numbers round!\n \n' +
        'You will create a puzzle board and then try to calculate a target value.',

        // First Numbers B
        "At the top of the screen is the number board. Right now, it's empty.\n \n" +
        'The player in control will create the puzzle.',

        // First Numbers C
        'Instructions to build the puzzle are at the bottom of the screen. ' +
        'The player in control will create the puzzle one number at a time. ' +
        'Press A to add a small number and B to add a big number. ',

        // First Numbers D
        'Small numbers are between 1 and 10, and there are two of each ' +
        'of the small numbers in the deck. ' +
        'Big numbers are 25, 50, 75, and 100.',

        // First Numbers E
        'Puzzles with two big numbers tend to be the easiest. ' +
        'Puzzles with no big numbers are REALLY difficult. ',

        // First Numbers F
        'Time to build your first numbers puzzle!',

        // First Numbers Timer A
        'A target number between 100 and 999 has been generated. ' +
        'Your job now is to try to create a series of calculations ' +
        'that gets as close to the target as possible.',

        // First Numbers Timer B
        'Only the four basic operations (add, subtract, multiply, divide) ' +
        'are permitted. A number may not be used more times than it appears ' +
        'on the puzzle board. Fractions and negative numbers are not allowed. ' +
        'You DO NOT have to use all of the numbers.',

        // First Numbers Timer C
        'Get as close to the target as you can! If you are more than 10 away ' +
        'from the target, then you will not earn any points.',

        // First Numbers Timer D
        'Your 30 seconds are about to start. Good luck!',

        // First Numbers Declare
        "How did you do? Let's find out!\n \n" +
        'Just like in the letters round, you must declare your bid. ' +
        'Enter the ending value of your calculations. ' +
        'Use the arrows to change your response. ' +
        'Press A to lock in your bid. ' +
        'When you lock your bid, it will highlight ' +
        'and you will not be able to change it.\n \n' +
        'Lock in your bids now!',

        // First Numbers Solve A
        "It's time to enter your solution!\n \n" +
        'Move the cursor with your D-pad and A to select. ' +
        'For each calculation in your sequence, ' +
        'select the first number, then an operator, ' +
        'then the second number. ' +
        'As long as the calculation is valid, the result ' +
        'will appear as a new tile. ' +
        'When you reach your bid, your solution will ' +
        'automatically lock in. You also can lock in your ' +
        'solution by selecting the = operator.\n \n' +
        'As a reminder, your bid appears in parentheses. ',

        // First Numbers Solve B
        'Just like in the game show, once you begin ' +
        'entering your calculation, you cannot restart. ' +
        'So go slowly and enter your calculations carefully.',

        // First Numbers Score
        "Now, let's score your solutions! " +
        'If your solution is valid, ' +
        'you earn 10 points if you hit the target exactly, ' +
        '7 points if you are +/- 5 of the target, and ' +
        '5 points if you are +/- 10 of the target.'
    ]

    export function areEnabled(): boolean {
        return getState(Tutorial.Enabled)
    }

    export function disable(): void {
        setState(Tutorial.Enabled, false)
    }

    export function enable(): void {
        resetTutorials()
    }

    function getState(tutorial: number): boolean {
        let key: string = PERSIST_KEY_PREFIX + tutorial
        if (!settings.exists(key)) {
            setState(tutorial, tutorial == Tutorial.Enabled)
        }
        return settings.readNumber(key) == 1
    }

    export function resetTutorials(): void {
        for (let i: number = 0; i < Tutorial.Last; i++) {
            setState(i, i == Tutorial.Enabled)
        }
    }

    function setState(tutorial: number, finished: boolean): void {
        let key: string = PERSIST_KEY_PREFIX + tutorial
        settings.writeNumber(key, finished ? 1 : 0)
    }

    function show(tutorial: Tutorial, loc: DialogLayout = DialogLayout.Full): void {
        if (!areEnabled() || getState(tutorial)) {
            if (areEnabled() && tutorial == Tutorial.First) {
                game.showLongText(TEXT[Tutorial.Enabled], DialogLayout.Center)
            }
            return
        }
        let m: string = 
            (loc == DialogLayout.Full ? GAME_NAME.toUpperCase() + " TUTORIAL\n \n" : "") +
            TEXT[tutorial]
        game.showLongText(m, loc)
        setState(tutorial, true)
    }

    /**
     * Exported functions to run tutorials.
     */

    export function firstTutorial(): void {
        show(Tutorial.First, DialogLayout.Full)
    }

    export function welcome(): void {
        show(Tutorial.Welcome, DialogLayout.Full)
    }

    export function firstRound(): void {
        show(Tutorial.FirstRound, DialogLayout.Center)
    }

    export function lettersRound(): void {
        show(Tutorial.FirstLettersA, DialogLayout.Full)
        setState(Tutorial.FirstLettersA, false)
        show(Tutorial.FirstLettersB, DialogLayout.Bottom)
        show(Tutorial.FirstLettersC, DialogLayout.Top)
        show(Tutorial.FirstLettersD, DialogLayout.Top)
        show(Tutorial.FirstLettersE, DialogLayout.Center)
        setState(Tutorial.FirstLettersA, true)
    }

    export function lettersRoundTimer(): void {
        show(Tutorial.FirstLettersTimer, DialogLayout.Bottom)
    }

    export function lettersRoundDeclare(): void {
        show(Tutorial.FirstLettersDeclare, DialogLayout.Full)
    }

    export function lettersRoundSolve(): void {
        show(Tutorial.FirstLettersSolve, DialogLayout.Bottom)
    }

    export function lettersRoundScore(): void {
        show(Tutorial.FirstLettersScore, DialogLayout.Full)
    }

    export function competitive(): void {
        show(Tutorial.FirstCompetitive, DialogLayout.Full)
    }

    export function numbersRound(): void {
        show(Tutorial.FirstNumbersA, DialogLayout.Full)
        setState(Tutorial.FirstNumbersA, false)
        show(Tutorial.FirstNumbersB, DialogLayout.Bottom)
        show(Tutorial.FirstNumbersC, DialogLayout.Bottom)
        show(Tutorial.FirstNumbersD, DialogLayout.Bottom)
        show(Tutorial.FirstNumbersE, DialogLayout.Bottom)
        show(Tutorial.FirstNumbersF, DialogLayout.Center)
        setState(Tutorial.FirstNumbersA, true)
    }

    export function numbersRoundTimer(): void {
        show(Tutorial.FirstNumbersTimerA, DialogLayout.Bottom)
        setState(Tutorial.FirstNumbersTimerA, false)
        show(Tutorial.FirstNumbersTimerB, DialogLayout.Bottom)
        show(Tutorial.FirstNumbersTimerC, DialogLayout.Bottom)
        show(Tutorial.FirstNumbersTimerD, DialogLayout.Bottom)
        setState(Tutorial.FirstNumbersTimerA, true)
    }

    export function numbersRoundDeclare(): void {
        show(Tutorial.FirstNumbersDeclare, DialogLayout.Full)
    }

    export function numbersRoundSolve(): void { 
        show(Tutorial.FirstNumbersSolveA, DialogLayout.Bottom)
        setState(Tutorial.FirstNumbersSolveA, false)
        show(Tutorial.FirstNumbersSolveB, DialogLayout.Bottom)
        setState(Tutorial.FirstNumbersSolveA, true)
    }

    export function numbersRoundScore(): void {
        show(Tutorial.FirstNumbersScore, DialogLayout.Full)
    }

    export function conundrum(): void {
        
    }
}