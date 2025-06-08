// src/shared/services/storage.service.ts
import { Service } from 'typedi';
import { config } from '@infrastructure/config';
import { logger } from '@shared/logger';
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

export interface UploadOptions {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  path?: string;
}

export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

@Service()
export class StorageService {
  private storageType: string;
  private basePath: string;

  constructor() {
    this.storageType = config.storage.type;
    this.basePath = config.storage.local.path || './uploads';
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    const { buffer, filename, mimeType, path: subPath } = options;

    switch (this.storageType) {
      case 'local':
        return this.uploadLocal(buffer, filename, mimeType, subPath);
      case 's3':
        return this.uploadS3(buffer, filename, mimeType, subPath);
      default:
        throw new Error(`Unsupported storage type: ${this.storageType}`);
    }
  }

  async storeFile(buffer: Buffer, filename: string, options?: { contentType?: string }): Promise<string> {
    const result = await this.upload({
      buffer,
      filename,
      mimeType: options?.contentType || 'application/octet-stream',
    });
    return result.url;
  }

  private async uploadLocal(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    subPath?: string,
  ): Promise<UploadResult> {
    const key = this.generateKey(filename);
    const filePath = path.join(this.basePath, subPath || '', key);
    const dir = path.dirname(filePath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(filePath, buffer);

    const url = `/files/${subPath ? subPath + '/' : ''}${key}`;

    logger.info('File uploaded locally', { key, size: buffer.length });

    return {
      url,
      key,
      size: buffer.length,
    };
  }

  private async uploadS3(buffer: Buffer, filename: string, mimeType: string, subPath?: string): Promise<UploadResult> {
    // S3 implementation would go here
    // For now, throw not implemented
    throw new Error('S3 storage not implemented yet');
  }

  private generateKey(filename: string): string {
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const id = nanoid(10);
    return `${name}-${id}${ext}`;
  }

  async delete(key: string): Promise<void> {
    switch (this.storageType) {
      case 'local':
        await this.deleteLocal(key);
        break;
      case 's3':
        await this.deleteS3(key);
        break;
    }
  }

  private async deleteLocal(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    await fs.unlink(filePath);
    logger.info('File deleted locally', { key });
  }

  private async deleteS3(key: string): Promise<void> {
    // S3 implementation
    throw new Error('S3 storage not implemented yet');
  }

  async exists(key: string): Promise<boolean> {
    switch (this.storageType) {
      case 'local':
        return this.existsLocal(key);
      case 's3':
        return this.existsS3(key);
      default:
        return false;
    }
  }

  private async existsLocal(key: string): Promise<boolean> {
    const filePath = path.join(this.basePath, key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async existsS3(key: string): Promise<boolean> {
    // S3 implementation
    throw new Error('S3 storage not implemented yet');
  }
}

// Create singleton instance
export const storageService = new StorageService();
