/**
 * Constants
 */

/**
 * Global variables
 */
let g_gameMode: number = SpriteKind.None
let g_gameType: GameType = null
let g_scoreMode: ScoreType = null

/**
 * Functions
 */
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

function start(): void {
    color.clearFadeEffect()
    color.setPalette(color.Arcade)
    Tutorial.firstTutorial()
}

/**
 * Event handlers
 */
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
                    start()
                })
            }
            break
    }
})

/**
 * Main
 */
runIntro()
