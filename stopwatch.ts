class Stopwatch extends TextSprite
{
    private isRunning : boolean
    private accumulatedMs : number
    private startTime : number

    constructor()
    {
        super("", Color.Black, Color.White, 12, 0, 0, 0, 1, Color.Blue)
        this.setIcon(img`
            . . 8 8 8 8 8 . . . . .
            . . . . 8 . . . . . . .
            . . . . 8 . . . . . . .
            . 8 8 8 8 8 8 8 . . . .
            8 . . . . . . . 8 . . .
            8 . . . 8 . . . 8 . . .
            8 . . . 8 . . . 8 . . .
            8 . . . 8 . . . 8 . . .
            8 . . . . 8 . . 8 . . .
            8 . . . . . 8 . 8 . . .
            8 . . . . . . . 8 . . .
            . 8 8 8 8 8 8 8 . . . .
        `)
        this.reset()
        game.currentScene().physicsEngine.addSprite(this)
    }

    public getState() : boolean
    {
        return this.isRunning
    }

    public reset() : void
    {
        this.isRunning = false
        this.accumulatedMs = 0
        this.update()
    }

    public start() : void
    {
        this.startTime = game.runtime()
        this.isRunning = true
    }

    public stop() : void
    {
        this.isRunning = false
        this.accumulatedMs += game.runtime() - this.startTime
        this.update()
    }

    public update() : void
    {
        let ms : number = this.accumulatedMs +
            (this.isRunning ? game.runtime() - this.startTime : 0)
        this.text = this.formatTime(ms)
        super.update()
    }

    private formatTime(ms : number) : string
    {
        let s : number = Math.idiv(ms, 1000) % 60
        let t : number = Math.idiv(ms % 1000, 100)
        let m : number = Math.idiv(ms, 60000)
        return (
            m > 0
            ? m.toString() + ":" + (
                s < 10
                ? "0" + s.toString()
                : s.toString()
            ) + "." + t.toString()
            : s.toString() + "." + t.toString()
        )
    }
}