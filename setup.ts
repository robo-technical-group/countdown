/**
 * Requires riknoll/arcade-mini-menu and riknoll/arcade-fancy-text.
 */
interface GameType {
    name: string
    rounds: string
    time: number
}

interface ScoreType {
    name: string
    desc: string
}

namespace Setup {
    const ANIM_PAUSE: number = 1000
    const ANIM_SPEED: number = 100
    const FADE_TIME: number = 1000
    const GAME_MODES: GameType[] = [{
        name: "Quick Game",
        rounds: "LLNC",
        time: 10
    },{
        name: "Short Game",
        rounds: "LNLNLNLNC",
        time: 30
    },{
        name: "Full Game",
        rounds: "LLNLLNLLNLLLLNC",
        time: 45
        }]
    const GET_READY: string = "Get pencil and paper,\nand get ready!\nPlayers:\nPress A to activate!"
    const SCORING_MODES: ScoreType[] = [{
        name: "Friendly Scoring",
        desc: "All players earn\npoints each round"
    },{
        name: "Competitive Scoring",
        desc: "Only best score\neach round counts"
    }]
    const TITLE: string = "COUNTDOWN"
    const TITLE_TOP_STOP: number = 10
    const TUTORIAL_MENU_ITEMS: string[] = [
        'Tutorials Off',
        'Tutorials On',
    ]

    let descSprite: fancyText.TextSprite = null
    let gameTypeSprite: fancyText.TextSprite = null
    let menu: miniMenu.MenuSprite = null
    let running: boolean = false
    let scoreModeSprite: fancyText.TextSprite = null
    let title: fancyText.TextSprite
    let tutorialModeSprite: fancyText.TextSprite = null

    export function beginSetup(): void {
        running = true
        color.setPalette(color.Black)
        title = fancyText.create(
            TITLE, null, Color.LightBlue, fancyText.art_deco_11
        )
        title.setKind(SpriteKind.Setup)
        
        color.startFade(color.Black, color.Arcade, FADE_TIME)
        let t: number = FADE_TIME + ANIM_PAUSE
        timer.after(t, () => {
            title.vy = 0 - ANIM_SPEED
        })
        t += (title.top - TITLE_TOP_STOP) / ANIM_SPEED * 1000
        timer.after(t, () => {
            title.vy = 0
        })
        t += ANIM_PAUSE
        timer.after(t, () => {
            showGameTypeMenu()
        })
    }

    export function endSetup(): void {
        color.startFade(color.Arcade, color.Black, FADE_TIME)
        timer.after(FADE_TIME, () => {
            sprites.destroyAllSpritesOfKind(SpriteKind.Setup)
            color.clearFadeEffect()
            color.setPalette(color.Arcade)
        })
    }

    export function isRunning(): boolean {
        return running
    }

    function setGameMode(): void {
        let g: GameType = GAME_MODES[menu.selectedIndex]
        gameTypeSprite = fancyText.create(
            g.name, null, Color.LightBlue, fancyText.bold_sans_7)
        gameTypeSprite.x = 80
        gameTypeSprite.top = title.bottom + 2
        gameTypeSprite.setKind(SpriteKind.Setup)
        menu.close()
        g_gameType = g
        showScoringMenu()
    }

    function setScoreMode(): void {
        let s: ScoreType = SCORING_MODES[menu.selectedIndex]
        scoreModeSprite = fancyText.create(
            s.name, null, Color.LightBlue, fancyText.bold_sans_7)
        scoreModeSprite.x = 80
        scoreModeSprite.top = gameTypeSprite.bottom + 2
        scoreModeSprite.setKind(SpriteKind.Setup)
        menu.close()
        g_scoreMode = s
        showTutorialMenu()
    }
    
    function setTutorialMode(): void {
        tutorialModeSprite = fancyText.create(
            TUTORIAL_MENU_ITEMS[menu.selectedIndex],
            null, Color.LightBlue, fancyText.bold_sans_7
        )
        tutorialModeSprite.x = 80
        tutorialModeSprite.top = scoreModeSprite.bottom + 2
        tutorialModeSprite.setKind(SpriteKind.Setup)
        menu.close()
        if (menu.selectedIndex == 0) {
            Tutorial.disable()
        } else {
            Tutorial.enable()
        }
        descSprite.setText(GET_READY)
        descSprite.setFont(fancyText.bold_sans_7)
        descSprite.x = 80
        descSprite.bottom = 110
        running = false
    }

    function showGameTypeMenu(): void {
        let items: miniMenu.MenuItem[] = []
        for (let g of GAME_MODES) {
            let mi: miniMenu.MenuItem = new miniMenu.MenuItem(g.name, null)
            items.push(mi)
        }
        menu = <miniMenu.MenuSprite>miniMenu.createMenuFromArray(items)
        menu.setKind(SpriteKind.Setup)
        menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, Color.Black)
        menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, Color.LightBlue)
        descSprite = fancyText.create("")
        descSprite.setKind(SpriteKind.Setup)
        updateGameType()
        menu.onSelectionChanged(() => {
            updateGameType()
        })
        menu.onButtonPressed(miniMenu.Button.A, () => {
            setGameMode()
        })
    }

    function showScoringMenu(): void {
        let items: miniMenu.MenuItem[] = []
        for (let s of SCORING_MODES) {
            let mi: miniMenu.MenuItem = new miniMenu.MenuItem(s.name, null)
            items.push(mi)
        }
        menu = <miniMenu.MenuSprite>miniMenu.createMenuFromArray(items)
        menu.setKind(SpriteKind.Setup)
        menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, Color.Black)
        menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, Color.LightBlue)
        updateScoreType()
        menu.onSelectionChanged(() => {
            updateScoreType()
        })
        menu.onButtonPressed(miniMenu.Button.A, () => {
            setScoreMode()
        })
    }

    function showTutorialMenu(): void {
        let items: miniMenu.MenuItem[] = []
        for (let s of TUTORIAL_MENU_ITEMS) {
            let mi: miniMenu.MenuItem = new miniMenu.MenuItem(s, null)
            items.push(mi)
        }
        menu = <miniMenu.MenuSprite>miniMenu.createMenuFromArray(items)
        menu.setKind(SpriteKind.Setup)
        menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, Color.Black)
        menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, Color.LightBlue)
        updateTutorialType()
        menu.onSelectionChanged(() => {
            updateTutorialType()
        })
        menu.onButtonPressed(miniMenu.Button.A, () => {
            setTutorialMode()
        })
        menu.y += 10
    }

    function updateDescSprite(): void {
        descSprite.bottom = 119
        descSprite.x = 80
    }

    function updateGameType(): void {
        let g: GameType = GAME_MODES[menu.selectedIndex]
        let lr: number = g.rounds.replaceAll('N', '').replaceAll('C', '').length
        let nr: number = g.rounds.replaceAll('L', '').replaceAll('C', '').length
        descSprite.setText(
            `${lr} letter round${lr == 1 ? "" : "s"}\n${nr} number round${nr == 1 ? "" : "s"}\nApprox ${g.time} minutes`
        )
        updateDescSprite()
    }

    function updateScoreType(): void {
        let s: ScoreType = SCORING_MODES[menu.selectedIndex]
        descSprite.setText(s.desc)
        updateDescSprite()
    }

    function updateTutorialType(): void {
        descSprite.setText(TUTORIAL_MENU_ITEMS[menu.selectedIndex])
        updateDescSprite()
    }
}