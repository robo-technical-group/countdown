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
            
            case SpriteKind.LettersBoardDeclare:
                Countdown.finalizeLetterBid(player)
                break
            
            case SpriteKind.LettersBoardSolve:
                Countdown.selectLetterCursorMp(player)
                break
            
            case SpriteKind.LettersBoardScore:
                if (Countdown.updateLetterScoreDone() && player == 1) {
                    beginNextRound()
                }
                break
            
            case SpriteKind.NumbersBoard:
                addSmall(player)
                break
            
            case SpriteKind.NumbersBoardDeclare:
                Countdown.finalizeNumberBid(player)
                break
        }
    }

    export function B(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.LettersBoard:
                addVowel(player)
                break
            
            case SpriteKind.LettersBoardSolve:
                Countdown.deleteLetterMp(player)
                break
                
            case SpriteKind.NumbersBoard:
                addBig(player)
                break
        }
    }

    export function Down(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.LettersBoardDeclare:
                Countdown.changeLettersBid(player, -1)
                break
            
            case SpriteKind.LettersBoardSolve:
                Countdown.moveLetterCursorMp(player, 0, 1)
                break
            
            case SpriteKind.NumbersBoardDeclare:
                Countdown.changeNumberBid(player, -1)
                break
        }
    }

    export function Left(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.LettersBoardDeclare:
                Countdown.changeLettersBid(player, -1)
                break
            
            case SpriteKind.LettersBoardSolve:
                Countdown.moveLetterCursorMp(player, -1, 0)
                break
            
            case SpriteKind.NumbersBoardDeclare:
                Countdown.changeNumberBid(player, -1)
                break
        }
    }

    export function Menu(): void {
        if (PauseMenu.menuVisible()) {
            PauseMenu.release()
        } else {
            PauseMenu.show()
        }
    }

    export function Right(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.LettersBoardDeclare:
                Countdown.changeLettersBid(player, 1)
                break
            
            case SpriteKind.LettersBoardSolve:
                Countdown.moveLetterCursorMp(player, 1, 0)
                break
            
            case SpriteKind.NumbersBoardDeclare:
                Countdown.changeNumberBid(player, 1)
                break
        }
    }

    export function Up(player: number): void {
        switch (g_gameMode) {
            case SpriteKind.LettersBoardDeclare:
                Countdown.changeLettersBid(player, 1)
                break
            
            case SpriteKind.LettersBoardSolve:
                Countdown.moveLetterCursorMp(player, 0, 1)
                break
             
            case SpriteKind.NumbersBoardDeclare:
                Countdown.changeNumberBid(player, 1)
                break
       }
    }
}