export const getCurrentEpochDay = () => Math.floor(Date.now() / 8.64e7)

export function* makePseudorandomGenerator(seed = Date.now(), max = Infinity): Generator<number> {
  let value = seed
  while (true) {
    value = (value * 16807) % 2147483647
    yield value % max
  }
}
