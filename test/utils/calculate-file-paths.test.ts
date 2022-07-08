import { calculateFilePaths } from '../../src/utils/calcuate-file-paths.util'

describe(calculateFilePaths, () => {
  test('Should return a flat array', () => {
    const results = calculateFilePaths(['test/__fixtures__/seeders/*.ts'])

    expect(results.length).toBeGreaterThan(0)
    expect(results.some((result) => result.includes('test/__fixtures__/seeders/pet.seeder.ts'))).toBeTruthy()
  })
})
