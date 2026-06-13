import type { RegistrationUser, CreateRegistrationInput } from '../domain/Registration.js'

export interface IRegistrationRepository {
  existsByEmail(email: string): Promise<boolean>
  findById(userId: string): Promise<RegistrationUser | null>
  findByEmail(email: string): Promise<RegistrationUser | null>
  findByActivationToken(token: string): Promise<RegistrationUser | null>
  findByResetToken(token: string): Promise<RegistrationUser | null>
  create(input: CreateRegistrationInput, activationToken: string, activationTokenExpiry: Date): Promise<RegistrationUser>
  createWithJoinRequest(
    input: CreateRegistrationInput,
    activationToken: string,
    activationTokenExpiry: Date,
    teamId: string
  ): Promise<RegistrationUser>
  activateAccount(userId: string): Promise<void>
  setActivationToken(userId: string, token: string, expiry: Date): Promise<void>
  setResetToken(userId: string, token: string, expiry: Date): Promise<void>
  resetPassword(userId: string, hashedPassword: string): Promise<void>
  declareReferee(userId: string): Promise<void>
  adminActivateUser(userId: string): Promise<void>
  adminUnblockUser(userId: string): Promise<void>
}