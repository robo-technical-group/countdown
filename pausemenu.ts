/**
 * Refer to pxt-common-packages/libs/game/systemmenu.ts.
 * Requires riknoll/arcade-mini-menu.
 */
namespace PauseMenu {
    enum Items {
        VolumeDown,
        VolumeUp,
        BrightnessDown,
        BrightnessUp,
        Stats,
        Console,
        Sleep,
        Close,
    }

    const MENU_TEXT: string[] = [
        'Volume down',
        'Volume up',
        'Brightness up',
        'Brightness down',
        'Show stats',
        'Show console',
        'Sleep',
        'Close',
    ]

    const MENU_TEXT_ALTERNATE: string[] = [
        '',
        '',
        '',
        '',
        'Hide stats',
        'Hide console',
        '',
        'Close',
    ]

    const MENU_TITLE: string = 'Pause Menu'
    const VOLUMES: number[] = [0, 32, 64, 96, 128, 160, 192, 224, 255]
    const Z: number = 255

    let isMenuRunning: boolean = false
    let isShowingStats: boolean = false
    let isShowingConsole: boolean = false
    let menu: miniMenu.MenuSprite = null
    let priorMode: number = SpriteKind.None
    let volume: number = 4

    function changeBrightness(delta: number): void {
        if ((delta < 0 && screen.brightness() > 0) ||
                (delta > 0 && screen.brightness() < 100)) {
            screen.setBrightness(screen.brightness() + delta)
            updateBrightness()
        }
    }

    function changeVolume(delta: number): void {
        if (
            (delta < 0 && volume > 0) ||
            (delta > 0 && volume < VOLUMES.length - 1)
        ) {
            if (delta < 0) {
                volume--
            } else {
                volume++
            }
            updateVolume()
            playVolume()
        }
    }

    export function disableEvents(): void {
        if (isMenuRunning) {
            menu.buttonEventsEnabled = false
        }
    }

    export function enableEvents(): void {
        if (isMenuRunning) {
            menu.buttonEventsEnabled = true
        }
    }

    export function hide(): void {
        if (isMenuRunning) {
            menu.setFlag(SpriteFlag.Invisible, true)
            menu.buttonEventsEnabled = false
        }
    }

    export function menuRunning(): boolean {
        return isMenuRunning
    }

    export function menuVisible(): boolean {
        return isMenuRunning &&
            ((menu.flags & SpriteFlag.Invisible) == 0)
    }

    function playVolume(): void {
        music.playTone(440, 500)
    }

    function processSelection(selection: string, selectedIndex: number): void {
        switch (selectedIndex) {
            case Items.VolumeDown:
                changeVolume(-1)
                break

            case Items.VolumeUp:
                changeVolume(1)
                break

            case Items.Stats:
                toggleStats()
                break

            case Items.Console:
                toggleConsole()
                break

            case Items.Sleep:
                sleep()
                break

            case Items.Close:
                release()
                break

            case Items.BrightnessUp:
                changeBrightness(5)
                break

            case Items.BrightnessDown:
                changeBrightness(-5)
                break
        }
    }

    export function release(): void {
        menu.close()
        isMenuRunning = false
        g_gameMode = priorMode
    }

    export function show(): void {
        if (isMenuRunning) {
            menu.setFlag(SpriteFlag.Invisible, false)
            menu.buttonEventsEnabled = true
            return
        }
        priorMode = g_gameMode
        g_gameMode = SpriteKind.PauseMenu
        let menuItems: miniMenu.MenuItem[] = []
        MENU_TEXT.forEach((value: string, index: number) =>
            menuItems.push(miniMenu.createMenuItem(value)))
        menu = <miniMenu.MenuSprite>miniMenu.createMenuFromArray(menuItems)
        menu.setTitle(MENU_TITLE)
        menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 140)
        menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 100)
        menu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Foreground, Color.White)
        menu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Background, Color.Wine)
        menu.top = 10
        menu.left = 10
        menu.z = Z
        isShowingConsole = game.consoleOverlay.isVisible()
        isShowingStats = game.stats
        updateBrightness()
        updateConsole()
        updateStats()
        updateVolume()
        menu.onButtonPressed(miniMenu.Button.A, processSelection)
        menu.onButtonPressed(miniMenu.Button.B, processSelection)
        isMenuRunning = true
    }

    function sleep(): void {
        power.deepSleep()
    }

    function toggleConsole(): void {
        isShowingConsole = !isShowingConsole
        game.consoleOverlay.setVisible(isShowingConsole)
        updateConsole()
    }

    function toggleStats(): void {
        isShowingStats = !isShowingStats
        game.stats = isShowingStats
        updateStats()
    }

    function updateBrightness(): void {
        menu.items[Items.BrightnessDown].text = MENU_TEXT[Items.BrightnessDown] +
            ' (' + screen.brightness() + ')'
        menu.items[Items.BrightnessUp].text = MENU_TEXT[Items.BrightnessUp] +
            ' (' + screen.brightness() + ')'
    }

    function updateConsole(): void {
        menu.items[Items.Console].text = isShowingConsole ?
            MENU_TEXT_ALTERNATE[Items.Console] :
            MENU_TEXT[Items.Console]
    }

    function updateStats(): void {
        menu.items[Items.Stats].text = isShowingStats ?
            MENU_TEXT_ALTERNATE[Items.Stats] :
            MENU_TEXT[Items.Stats]
        if (!isShowingStats && control.EventContext.onStats) {
            control.EventContext.onStats('');
        }
    }

    function updateVolume(): void {
        let v: number = VOLUMES[volume]
        music.setVolume(v)
        menu.items[Items.VolumeDown].text = MENU_TEXT[Items.VolumeDown] +
            ' (' + v + ')'
        menu.items[Items.VolumeUp].text = MENU_TEXT[Items.VolumeUp] +
            ' (' + v + ')'
    }
}
