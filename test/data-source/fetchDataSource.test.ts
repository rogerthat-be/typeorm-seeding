import { fetchDataSource, reconfigureDataSource } from '../../src/data-source'

import { DataSource } from 'typeorm'

describe(fetchDataSource, () => {
  beforeEach(() => {
    reconfigureDataSource({
      root: __dirname,
      dataSourceConfig: '../ormconfig.ts',
    })
  })

  test('Should create a data source', async () => {
    const dataSource = await fetchDataSource()
    expect(dataSource).toBeInstanceOf(DataSource)
  })

  test('Should get an existing data source', async () => {
    const dataSource = await fetchDataSource()
    expect(dataSource).toBeInstanceOf(DataSource)
  })
})
