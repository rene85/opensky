// Strongly typed identifiers. Distinguished from plain strings.

export class Identifier<T = number | string> {
    #identifier: T
    constructor(identifier: T) {
        this.#identifier = identifier
    }
    get string(): string {
        return `${this.#identifier}`
    }
}

export const identifier = (i: number | string) => new Identifier(i)
