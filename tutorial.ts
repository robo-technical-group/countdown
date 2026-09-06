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
        FirstNumbers,
        FirstNumbersTimer,
        FirstNumbersDeclare,
        FirstNumbersSolve,
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
        // Enabled: No text.
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
        'CONSONANT or VOWEL out loud./j',

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
        'Now, you must declare your score. ' +
        'Enter the length of the longest word that you found. ' +
        'Use the arrows to change your response. ' +
        'Press A to lock in your score. ' +
        'When you lock your score, it will highlight ' +
        'and you will not be able to change it.\n \n' +
        'Lock in your scores now!',
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

    }

    export function numbersRound(): void {

    }

    export function numbersRoundTimer(): void {

    }

    export function numbersRoundDeclare(): void {

    }

    export function numbersRoundSolve(): void {

    }

    export function conundrum(): void {
        
    }
}