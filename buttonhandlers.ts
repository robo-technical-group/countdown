namespace ButtonHandlers {
    export function A(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.Intro:
            case SpriteKind.Splash:
            case SpriteKind.Setup:
                Players.register(player)
                break
            
            case SpriteKind.LettersBoard:
                addConsonant(player)
                break
        }
    }

    export function B(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.LettersBoard:
                addVowel(player)
                break
        }
    }

    export function Down(player: number): void {

    }

    export function Left(player: number): void {

    }

    export function Menu(): void {
        if (PauseMenu.menuVisible()) {
            PauseMenu.release()
        } else {
            PauseMenu.show()
        }
    }

    export function Right(player: number): void {

    }

    export function Up(player: number): void {

    }

}