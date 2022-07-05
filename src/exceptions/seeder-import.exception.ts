export class SeederImportException extends Error {
  constructor(message: string) {
    super(`Error importing seeders: ${message}`)
  }
}
