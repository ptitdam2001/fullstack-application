import { describe, it, expect, vi } from 'vitest'
import { TeamJoinRequestUseCases } from './TeamJoinRequestUseCases.js'
import type { ITeamJoinRequestRepository } from '../ports/ITeamJoinRequestRepository.js'
import { JoinRequestNotFoundError, JoinRequestNotPendingError, AlreadyMemberError } from '../domain/TeamJoinRequestErrors.js'
import { JoinRequestStatus } from '../domain/TeamJoinRequest.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'

const now = new Date()

const mockRequest = {
  id: 'req-1',
  userId: 'user-1',
  teamId: 'team-1',
  requestedRole: TeamRole.PLAYER,
  status: JoinRequestStatus.PENDING,
  createdAt: now,
  updatedAt: now,
}

const makeRepo = (overrides: Partial<ITeamJoinRequestRepository> = {}): ITeamJoinRequestRepository => ({
  findById: vi.fn().mockResolvedValue(mockRequest),
  findByUserAndTeam: vi.fn().mockResolvedValue(null),
  findByTeam: vi.fn().mockResolvedValue([mockRequest]),
  upsert: vi.fn().mockResolvedValue(mockRequest),
  approve: vi.fn().mockResolvedValue({ ...mockRequest, status: JoinRequestStatus.APPROVED }),
  refuse: vi.fn().mockResolvedValue({ ...mockRequest, status: JoinRequestStatus.REFUSED }),
  ...overrides,
})

const make = (repo?: Partial<ITeamJoinRequestRepository>) => new TeamJoinRequestUseCases(makeRepo(repo))

describe('TeamJoinRequestUseCases.createRequest', () => {
  it('upserts PENDING request when no existing request', async () => {
    const repo = makeRepo()
    await make(repo).createRequest('user-1', 'team-1', TeamRole.PLAYER)
    expect(repo.upsert).toHaveBeenCalledWith('user-1', 'team-1', TeamRole.PLAYER)
  })

  it('throws AlreadyMemberError when existing request is APPROVED', async () => {
    await expect(
      make({ findByUserAndTeam: vi.fn().mockResolvedValue({ ...mockRequest, status: JoinRequestStatus.APPROVED }) }).createRequest(
        'user-1',
        'team-1',
        TeamRole.PLAYER
      )
    ).rejects.toThrow(AlreadyMemberError)
  })

  it('re-submits (upsert) when existing request is REFUSED', async () => {
    const repo = makeRepo({ findByUserAndTeam: vi.fn().mockResolvedValue({ ...mockRequest, status: JoinRequestStatus.REFUSED }) })
    await make(repo).createRequest('user-1', 'team-1', TeamRole.COACH)
    expect(repo.upsert).toHaveBeenCalledWith('user-1', 'team-1', TeamRole.COACH)
  })
})

describe('TeamJoinRequestUseCases.getTeamRequests', () => {
  it('returns all requests for team without status filter', async () => {
    const repo = makeRepo()
    const result = await make(repo).getTeamRequests('team-1')
    expect(repo.findByTeam).toHaveBeenCalledWith('team-1', undefined)
    expect(result).toHaveLength(1)
  })

  it('passes status filter to repository', async () => {
    const repo = makeRepo()
    await make(repo).getTeamRequests('team-1', JoinRequestStatus.PENDING)
    expect(repo.findByTeam).toHaveBeenCalledWith('team-1', JoinRequestStatus.PENDING)
  })
})

describe('TeamJoinRequestUseCases.updateRequest', () => {
  it('refuses request when action is refuse', async () => {
    const repo = makeRepo()
    const result = await make(repo).updateRequest('req-1', 'team-1', 'refuse', 'approver-1')
    expect(repo.refuse).toHaveBeenCalledWith('req-1')
    expect(result.status).toBe(JoinRequestStatus.REFUSED)
  })

  it('approves request when action is approve', async () => {
    const repo = makeRepo()
    const result = await make(repo).updateRequest('req-1', 'team-1', 'approve', 'approver-1')
    expect(repo.approve).toHaveBeenCalledWith('req-1', 'user-1', 'team-1', TeamRole.PLAYER)
    expect(result.status).toBe(JoinRequestStatus.APPROVED)
  })

  it('throws JoinRequestNotFoundError when request not found', async () => {
    await expect(
      make({ findById: vi.fn().mockResolvedValue(null) }).updateRequest('bad-id', 'team-1', 'approve', 'approver-1')
    ).rejects.toThrow(JoinRequestNotFoundError)
  })

  it('throws JoinRequestNotFoundError when teamId does not match', async () => {
    await expect(
      make().updateRequest('req-1', 'wrong-team', 'approve', 'approver-1')
    ).rejects.toThrow(JoinRequestNotFoundError)
  })

  it('throws JoinRequestNotPendingError when request is already APPROVED', async () => {
    await expect(
      make({ findById: vi.fn().mockResolvedValue({ ...mockRequest, status: JoinRequestStatus.APPROVED }) }).updateRequest(
        'req-1',
        'team-1',
        'approve',
        'approver-1'
      )
    ).rejects.toThrow(JoinRequestNotPendingError)
  })
})