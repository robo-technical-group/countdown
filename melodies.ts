/**
 * Requires riknoll/arcade-mml.
 */
namespace Melodies {
    const INSTRUMENT: mml.MMLInstrument = mml.Dog
    const VOLUME_FADE_STEP: number = 50
    let beatsPerMeasure: number = 0
    let currentMeasure: number = -1
    let currentTempo: number = 0
    let firstMeasure: number = 0
    let isPlaying: boolean = false
    let lastMeasure: number = 0
    let measureMs: number = 0
    let nextMeasureTime: number = 0

    function init(): void {
        nextMeasureTime = 0
        currentMeasure = -1
        currentTempo = 120
        beatsPerMeasure = 4
        measureMs = 60000 * beatsPerMeasure / currentTempo
    }
    
    export function playing(): boolean {
        return isPlaying
    }

    export function playMainTheme(): void {
        init()
        firstMeasure = 1
        lastMeasure = 16
        console.log("Playing main theme.")
        isPlaying = true
    }

    export function playTimer(): void {
        init()
        firstMeasure = 17
        lastMeasure = 32
        console.log("Playing timer melody.")
        isPlaying = true
    }

    export function nextUpdate(): number {
        return nextMeasureTime
    }

    export function startNextMeasure(): void {
        if (currentMeasure == -1) {
            currentMeasure = firstMeasure
        }
        if (
            currentMeasure > lastMeasure ||
            currentMeasure >= COUNTDOWN_MML.length
        ) {
            isPlaying = false
            console.log("Finished playing melody.")
            return
        }
        let tracks: mml.MMLTrack[] = []
        for (let t of COUNTDOWN_MML[currentMeasure]) {
            let track: mml.MMLTrack = new mml.MMLTrack(t, INSTRUMENT)
            tracks.push(track)
        }
        // Allow for an empty measure.
        if (tracks.length > 0) {
            music.play(new mml.MMLPlayable(tracks), music.PlaybackMode.InBackground)
        }
        currentMeasure++
        nextMeasureTime = game.runtime() + measureMs
    }

    export function stopAll(): void {
        isPlaying = false
        music.stopAllSounds()
    }
}

game.onUpdate(() => {
    if (Melodies.playing() && game.runtime() >= Melodies.nextUpdate()) {
        Melodies.startNextMeasure()
    }
})