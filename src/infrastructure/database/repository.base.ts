import { PrismaClient } from '@prisma/client'
import { prisma } from './prisma.service'

export interface PaginationOptions {
  page?: number
  limit?: number
  orderBy?: any
  where?: any
  include?: any
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export abstract class BaseRepository<T, CreateDTO, UpdateDTO> {
  protected prisma: PrismaClient
  protected model: any

  constructor(protected modelName: keyof PrismaClient) {
    this.prisma = prisma.client
    this.model = (this.prisma as any)[modelName]
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
      include
    })
  }

  async findOne(where: any, include?: any): Promise<T | null> {
    return this.model.findFirst({
      where,
      include
    })
  }

  async findMany(where?: any, options?: any): Promise<T[]> {
    return this.model.findMany({
      where,
      ...options
    })
  }

  async create(data: CreateDTO): Promise<T> {
    return this.model.create({ data })
  }

  async createMany(data: CreateDTO[]): Promise<{ count: number }> {
    return this.model.createMany({
      data,
      skipDuplicates: true
    })
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    return this.model.update({
      where: { id },
      data
    })
  }

  async updateMany(where: any, data: UpdateDTO): Promise<{ count: number }> {
    return this.model.updateMany({
      where,
      data
    })
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id }
    })
  }

  async deleteMany(where: any): Promise<{ count: number }> {
    return this.model.deleteMany({ where })
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where })
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.count(where)
    return count > 0
  }

  async paginate(options: PaginationOptions): Promise<PaginatedResult<T>> {
    return prisma.paginate(this.modelName, options)
  }

  async transaction<R>(fn: (tx: PrismaClient) => Promise<R>): Promise<R> {
    return prisma.transaction(fn)
  }
}