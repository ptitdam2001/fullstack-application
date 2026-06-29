export class AgeCategoryNotFoundError extends Error {
  constructor(id: string) {
    super(`AgeCategory not found: ${id}`)
    this.name = 'AgeCategoryNotFoundError'
  }
}
