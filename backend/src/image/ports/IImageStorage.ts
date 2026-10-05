import type { ImageContent, SavedImage, SaveImageInput } from '../domain/Image.js'

/**
 * Where image bytes live. The MongoDB adapter (PrismaImageStorage) is the first implementation;
 * the port exists so it can be replaced by S3 or another file store without touching the use cases.
 *
 * `url` returned by `save` is what gets persisted on the owning entity (e.g. `user.avatar`) and handed
 * to the clients as is. The MongoDB adapter returns a RELATIVE url served by this API (`/images/{id}`,
 * to be resolved against the API base URL); an S3 adapter would return an absolute URL.
 *
 * The `id` is opaque and chosen by the adapter. It ends up in a public URL, so it must not be guessable
 * from another id (no sequence, no timestamp).
 *
 * An image is immutable: replacing a picture means saving a new one (new id, new url) and deleting the old.
 */
export interface IImageStorage {
  save(input: SaveImageInput): Promise<SavedImage>
  /** Null when the id is unknown or is not an id this storage could have issued. */
  findById(id: string): Promise<ImageContent | null>
  /** No-op when the id is unknown. */
  delete(id: string): Promise<void>
  /** Deletes every image of an owner. Only for when the owner itself goes away — see `deleteByOwnerAndUrl`. */
  deleteByOwner(ownerId: string): Promise<void>
  /**
   * Deletes the image behind `url` (a url returned by `save`), provided it belongs to `ownerId`. No-op for a
   * url this storage did not issue, or for the image of another owner: the url comes from data an admin can
   * write freely (`user.avatar`), so it never decides alone what gets deleted.
   *
   * This is how a replaced image is dropped. Deleting "every image of the owner but the current one" is not
   * safe: the image of a concurrent upload, just saved or just referenced, would go with the others.
   */
  deleteByOwnerAndUrl(ownerId: string, url: string): Promise<void>
}
