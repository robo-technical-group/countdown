namespace Array {
    //% block="shuffle array $arr"
    //group="Operations"
    export function shuffleArray(arr: any[]): void {
        shuffle(arr)
    }
    
    export function shuffle<T>(arr: T[]): void {
        const h: number = arr.length - 1
        for (let i: number = 0; i <= h; i++) {
            let swap_i: number = randint(0, h)
            if (i != swap_i) {
                let t: T = arr[i]
                arr[i] = arr[swap_i]
                arr[swap_i] = t
            }
        }
    }
}