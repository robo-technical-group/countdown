/**
 * Methods for running a letters round.
 * Requires arrays extension (see array.ts).
 */
namespace Countdown {
    interface LetterFreqency {
        letter: string
        count: number
    }
    const CONSONANT_DISTRIBUTION: LetterFreqency[] = [
        { letter: "B", count: 2 },
        { letter: "C", count: 3 },
        { letter: "D", count: 6 },
        { letter: "F", count: 2 },
        { letter: "G", count: 4 },
        { letter: "H", count: 2 },
        { letter: "J", count: 1 },
        { letter: "K", count: 1 },
        { letter: "L", count: 5 },
        { letter: "M", count: 4 },
        { letter: "N", count: 8 },
        { letter: "P", count: 4 },
        { letter: "Q", count: 1 },
        { letter: "R", count: 9 },
        { letter: "S", count: 9 },
        { letter: "T", count: 9 },
        { letter: "V", count: 2 },
        { letter: "W", count: 2 },
        { letter: "X", count: 1 },
        { letter: "Y", count: 1 },
        { letter: "Z", count: 1 },
    ]
    const VOWEL_DISTRIBUTION: LetterFreqency[] = [
        { letter: "A", count: 15 },
        { letter: "E", count: 21 },
        { letter: "I", count: 13 },
        { letter: "O", count: 13 },
        { letter: "U", count: 5 },
    ]

    let consonants: string[] = []
    let vowels: string[] = []

    let currConsonant: number = 0
    let currLetter: number = 0
    let currVowel: number = 0

    let currLetterPuzzle: string = ""
    let currLetterSolution: string = ""
    let numConsonants: number = 0
    let numVowels: number = 0

    export function addConsonant(): string {
        if (currLetter == 9 || numConsonants == 6) {
            return ""
        }
        numConsonants++
        let c: string = getNextConsonant()
        addLetter(c)
        return c
    }

    function addLetter(letter: string): void {
        currLetterPuzzle += letter
        currLetter++
    }

    export function addVowel(): string {
        if (currLetter == 9 || numVowels == 5) {
            return ""
        }
        numVowels++
        let v: string = getNextVowel()
        addLetter(v)
        return v
    }

    function buildLetters(dist: LetterFreqency[]): string[] {
        let toReturn: string[] = []
        for (let d of dist) {
            for (let i: number = 0; i < d.count; i++) {
                toReturn.push(d.letter)
            }
        }
        Array.shuffle(toReturn)
        return toReturn
    }

    export function findLetterPuzzleSolution(): void {
        let lists: TernaryStringSet[] = [
            WordLists.words9,
            WordLists.words8,
            WordLists.words7,
            WordLists.words6,
            WordLists.words5,
            WordLists.words4,
            WordLists.words3,
        ]
        for (let s of lists) {
            let candidates: string[] = s.getArrangementsOf(currLetterPuzzle)
            if (candidates.length > 0) {
                currLetterSolution = candidates._pickRandom()
                break
            }
        }
    }

    export function getCurrLetter(): number {
        return currLetter
    }

    export function getLetterPuzzle(): string {
        return currLetterPuzzle
    }

    export function getLetterSolution(): string {
        return currLetterSolution
    }

    export function getNextConsonant(): string {
        currConsonant++
        return consonants[currConsonant - 1]
    }

    export function getNextVowel(): string {
        currVowel++
        return vowels[currVowel - 1]
    }

    export function getNumConsonants(): number {
        return numConsonants
    }

    export function getNumVowels(): number {
        return numVowels
    }

    function init(): void {
        consonants = buildLetters(CONSONANT_DISTRIBUTION)
        currConsonant = 0
        vowels = buildLetters(VOWEL_DISTRIBUTION)
        currVowel = 0
        if (!WordLists.isReady()) {
            WordLists.buildWordSets()
        }
    }

    export function isWordValid(word: string): boolean {
        const wordLists: TernaryStringSet[] = WordLists.getWordLists()
        if (wordLists.length <= word.length) {
            return false
        }
        if (wordLists[word.length] == null) {
            return false
        }
        return wordLists[word.length].has(word)
    }

    export function startLettersRound(): void {
        if (consonants.length == 0) {
            init()
        }
        if (consonants.length - currConsonant < 6) {
            consonants = buildLetters(CONSONANT_DISTRIBUTION)
            currConsonant = 0
        }
        if (vowels.length - currVowel < 5) {
            vowels = buildLetters(VOWEL_DISTRIBUTION)
            currVowel = 0
        }
        currLetterPuzzle = ""
        currLetterSolution = ""
        numConsonants = 0
        numVowels = 0
        currLetter = 0
    }
}