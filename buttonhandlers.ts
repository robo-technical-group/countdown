namespace ButtonHandlers {
    export function A(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.Intro:
            case SpriteKind.Splash:
            case SpriteKind.Setup:
                Players.register(player)
        }
    }

    export function B(player: number): void {

    }
    export function Down(player: number): void {

    }

    export function Left(player: number): void {

    }

    export function Menu(player: number): void {

    }

    export function Right(player: number): void {

    }

    export function Up(player: number): void {

    }

}