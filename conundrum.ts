/**
 * Methods for running a conundrum round.
 * Requires arrays extension (see array.ts) and strings extension (see string.ts).
 */
namespace Countdown {
    function permute<T>(arr: T[]): T[][] {
        const result: T[][] = []
        const stack: { arr: T[], temp: T[] }[] = [{ arr, temp: [] }]

        while (stack.length) {
            const { arr, temp } = stack.pop()
            if (!arr.length) {
                result.push(temp)
            } else {
                for (let i = 0; i < arr.length; i++) {
                    const newArr = arr.slice(0, i).concat(arr.slice(i + 1))
                    stack.push({ arr: newArr, temp: temp.concat([arr[i],]) })
                }
            }
        }
        return result
    }
    
    //% block="get permutations of strings $s"
    export function stringPermutations(s: string[]): string[] {
        const perms: string[][] = permute(s)
        return perms.map((value: string[], index: number) => value.join(""))
    }

    const CONUNDRUM_COMBOS: number[][] = [[2, 7], [3, 6], [4, 5], [2, 2, 5], [2, 3, 4]]

    let currConundrum: string = ""
    let conundrumSolution: string = ""
    let conundrumWords: string[] = []

    //% block
    export function generateConundrum(): void {
        if (WordLists.words2 == null) {
            WordLists.buildWordSets()
        }
        const conundrumWordLists: TernaryStringSet[] = WordLists.getWordLists()
        let conundrum: string = ""
        while (true) {
            let combo: number[] = CONUNDRUM_COMBOS._pickRandom()
            let words: string[] = []
            for (let len of combo) {
                words.push(WordLists.getRandomWordFromSet(conundrumWordLists[len]))
            }
            let candidates: string[] = stringPermutations(words)
            for (let c of candidates) {
                if (isWordValid(c)) {
                    continue
                }
            }
            let arrangements: string[] = WordLists.getArrangements(candidates[0], WordLists.words9)
            if (arrangements.length == 1) {
                let solution: string = arrangements[0]
                let newCandidates: string[] = []
                for (let c of candidates) {
                    if (String.distance(c, solution) >= 4) {
                        newCandidates.push(c)
                    }
                }
                if (newCandidates.length > 0) {
                    conundrum = newCandidates._pickRandom()
                    conundrumSolution = solution
                    setWords(conundrum, words)
                    break
                }
            }
        }
        currConundrum = conundrum
    }

    export function getConundrum(): string {
        return currConundrum
    }

    export function getConundrumAsWords(): string[] {
        return conundrumWords
    }

    export function getConundrumSolution(): string {
        return conundrumSolution
    }

    function setWords(conundrum: string, words: string[]): void {
        let count: number = 0
        let loc: number = 0
        conundrumWords = []
        while (count < words.length) {
            for (let w of words) {
                if (conundrum.indexOf(w) == loc) {
                    conundrumWords.push(w)
                    loc += w.length
                    count++
                    break
                }
            }
        }
    }
}