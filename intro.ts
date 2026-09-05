/**
 * Requires arcade-text extension.
 */
namespace Intro {
    const BACK_COLORS: Color[] = [Color.White, Color.Blue]
    const FORE_COLORS: Color[] = [Color.Black, Color.White]
    const TITLE: string = "COUNTDOWN"
    
    let titleSprites: TextSprite[] = []

    export function beginIntro(): void {
        let left: number = 8
        let top: number = 10
        let ts: TextSprite
        for (let c of TITLE) {
            ts = textsprite.create(c, BACK_COLORS[0], FORE_COLORS[0])
            ts.maxFontHeight = 12
            ts.left = left
            ts.top = top
            ts.padding = 2
            ts.setKind(SpriteKind.Intro)
            ts.update()
            titleSprites.push(ts)
            left += ts.width
        }

        ts = textsprite.create("Please wait....")
        ts.setPosition(80, 60)
        ts.setKind(SpriteKind.Intro)

        ts = textsprite.create("Players:")
        ts.setMaxFontHeight(5)
        ts.setPosition(80, 100)
        ts.setKind(SpriteKind.Intro)

        ts = textsprite.create("Press A to activate!")
        ts.setMaxFontHeight(5)
        ts.setPosition(80, 110)
        ts.setKind(SpriteKind.Intro)
    }

    export function endIntro(): void {
        sprites.destroyAllSpritesOfKind(SpriteKind.Intro)
    }

    export function update(): void {
        let i: number = 8 - WordLists.currentBuild()
        if (i < 0 || i + 1 > titleSprites.length) {
            return
        }
        let ts: TextSprite = titleSprites[i]
        ts.fg = FORE_COLORS[1]
        ts.bg = BACK_COLORS[1]
        ts.update()
    }
}