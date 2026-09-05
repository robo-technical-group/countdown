/**
 * Constants
 */

/**
 * Global variables
 */
let g_gameMode: number = SpriteKind.None

/**
 * Functions
 */
function runIntro(): void {
    Intro.beginIntro()
    WordLists.startBuildingWordSets()
    g_gameMode = SpriteKind.Intro
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
            } else if (!WordLists.isBuilding()) {
                Intro.update()
                WordLists.buildNextWordSet()
            }
            break
    }
})

/**
 * Main
 */
runIntro()