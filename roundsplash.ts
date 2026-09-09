/**
 * Uses microsoft/arcade-timers and riknoll/arcade-fancy-text.
 */
namespace RoundSplash {
    const ROUND: string = "Round"

    let roundSprite: fancyText.TextSprite = null
    let roundDesc: fancyText.TextSprite = null

    export function beginSplash(round: number, kind: string): void {
        roundSprite = fancyText.create(ROUND + " " + round,
            null, Color.LightBlue, fancyText.art_deco_11
        )
        roundSprite.setKind(SpriteKind.Splash)
        roundDesc = fancyText.create(kind,
            null, Color.LightBlue, fancyText.art_deco_11
        )
        roundDesc.setKind(SpriteKind.Splash)

        roundSprite.x = -30
        roundSprite.vx = 110
        roundDesc.y = 130
        roundDesc.vy = -50

        timer.after(1000, pauseSprites)
        timer.after(3000, exitSprites)
        timer.after(4000, endSplash)
    }

    export function endSplash(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.Splash)
    }

    function exitSprites(): void {
        roundSprite.vy = 80
        roundDesc.vx = -150
    }

    function pauseSprites(): void {
        roundSprite.vx = 0
        roundDesc.vy = 0
    }
}