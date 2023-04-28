export const added = <T>(s: Set<T>, value: T): boolean => {
    const added = !s.has(value)
    s.add(value)
    return added
}
