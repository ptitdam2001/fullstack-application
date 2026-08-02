export class SeasonNotFoundError extends Error {
  constructor(id: string) {
    super(`Season not found: ${id}`)
    this.name = 'SeasonNotFoundError'
  }
}

export class SeasonDuplicateLabelError extends Error {
  constructor(label: string) {
    super(`Season with label "${label}" already exists`)
    this.name = 'SeasonDuplicateLabelError'
  }
}

export class SeasonHasUnfinishedChampionshipsError extends Error {
  constructor(id: string) {
    super(`Season ${id} has an unfinished linked championship`)
    this.name = 'SeasonHasUnfinishedChampionshipsError'
  }
}
