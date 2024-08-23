export type IdentifiedEntity<T> = T & {
    _id: string;
}

export interface ICRUDService<T> {
    getList(): T[];
    getOne(id: string): IdentifiedEntity<T>|undefined;
    create(item: T): IdentifiedEntity<T>;
    update(id: string, values: Partial<T>): IdentifiedEntity<T>|undefined;
    delete(id: string): void;
} 