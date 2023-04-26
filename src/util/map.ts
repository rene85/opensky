export const emptyMap = <K, V>() => new Map<K, V>()

export const updateOrDefaultMUTATE = <K, V>(
    map: Map<K, V>,
    key: K,
    update: (old: V) => V,
    defaultValue: V
): Map<K, V> =>
    map.set(key, map.has(key) ? update(map.get(key) as V) : defaultValue)

export const updateWithDefaultMUTATE = <K, V>(
    map: Map<K, V>,
    key: K,
    update: (old: V) => V,
    defaultValue: V
): Map<K, V> =>
    map.set(
        key,
        map.has(key) ? update(map.get(key) as V) : update(defaultValue)
    )
