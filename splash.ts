/**
 * Requires jwunderl/pxt-color and riknoll/arcade-fancy-text.
 */
namespace RtgSplash {
    const FADE_SPEED: number = 1000
    const FLARE_SPEED: number = 50
    const SUBTITLE: string = "Presents"
    const SUBTITLE_PAUSE: number = 500
    const SUBTITLE_SPEED: number = 1000
    const TITLES: string[] = [
        "ROBO",
        "TECHNICAL",
        "GROUP"
    ]
    let running: boolean = false

    export function beginSplash(): void {
        running = true
        let t: number = 0
        color.setPalette(color.Black)
        showLogo()
        color.startFade(color.Black, color.Arcade, FADE_SPEED)
        t += FADE_SPEED
        timer.after(t, () => {
            showFlare()
            music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
        })
        t += FLARE_SPEED * assets.animation`flare`.length
        timer.after(t, () => {
            showSubtitle()
        })
        t += SUBTITLE_SPEED + SUBTITLE_PAUSE
        timer.after(t, () => {
            color.startFade(color.Arcade, color.Black, FADE_SPEED)
        })
        t += FADE_SPEED
        timer.after(t, () => {
            running = false
        })
    }

    export function endSplash(): void {
        running = false
        color.clearFadeEffect()
        color.setPalette(color.Black)
        sprites.destroyAllSpritesOfKind(SpriteKind.Splash)
        color.setPalette(color.Arcade)
    }

    export function isRunning(): boolean {
        return running
    }

    function showFlare(): void {
        let i: Image = image.create(15, 15)
        let f: Sprite = sprites.create(i, SpriteKind.Splash)
        f.x = 15
        f.y = 30
        animation.runImageAnimation(f, assets.animation`flare`, 
            FLARE_SPEED, false)
    }

    function showLogo(): void {
        let left: number = 15
        let top: number = 30
        let logo: Sprite = sprites.create(
            assets.image`RTGLogo`, SpriteKind.Splash
        )
        logo.top = top
        logo.left = left

        left += 52
        top += 3
        for (let t of TITLES) {
            let title: fancyText.TextSprite = fancyText.create(
                t, null, Color.Yellow,
                fancyText.geometric_serif_11
            )
            title.left = left
            title.top = top
            title.setKind(SpriteKind.Splash)
            top += 16
        }
    }

    function showSubtitle(): void {
        let st: fancyText.TextSprite = fancyText.create(
            SUBTITLE, null, Color.RoseBouquet,
            fancyText.geometric_serif_11
        )
        st.x = 80
        st.y = 100
        st.setKind(SpriteKind.Splash)
        st.animateForTime(SUBTITLE_SPEED)
    }
}