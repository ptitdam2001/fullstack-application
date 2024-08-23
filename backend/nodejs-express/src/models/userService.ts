import type { ICRUDService, IdentifiedEntity } from "./CRUDService";
import { v4 as uuidv4 } from 'uuid';

type IUser = {
    lastname: string;
    firstname: string;
}

export class UserService implements ICRUDService<IUser> {
    users: IdentifiedEntity<IUser>[]

    constructor() {
        this.users = []
    }

    getList(): IUser[] {
       return this.users;
    }
    getOne(id: string): IdentifiedEntity<IUser> | undefined {
        return this.users.find((user) => user._id === id)
    }
    create(item: IUser): IdentifiedEntity<IUser> {
        const newItem = {
            ...item,
            _id: uuidv4(),
        };
        this.users.push(newItem)
        return newItem
    }
    update(id: string, values: Partial<IUser>): IdentifiedEntity<IUser> | undefined {
        const index = this.users.findIndex((user) => user._id === id)
        if (index < 0) {
            return undefined
        }
        const updated = {
            ...(this.users[index]),
            ...values,
        }   
        this.users[index] = updated;
        return updated
    }
    delete(id: string): void {
        const index = this.users.findIndex((user) => user._id === id)
        if (index < 0) {
            throw new Error('user does not exist')
        }

        this.users = this.users.filter((user) => user._id !==  id)
        return
    }
    
}