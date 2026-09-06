namespace Tutorial {
    enum Tutorial {
        Enabled = 0,
        First,
        Welcome,
        FirstRound,
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
        /*
        if (!areEnabled()) {
            if (game.ask(ASK[0], ASK[1])) {
                enable()
            }
        }
        */
        show(Tutorial.First, DialogLayout.Full)
    }

    export function welcome(): void {
        show(Tutorial.Welcome, DialogLayout.Full)
    }

    export function firstRound(): void {
        show(Tutorial.FirstRound, DialogLayout.Center)
    }
}