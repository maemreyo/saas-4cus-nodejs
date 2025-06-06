import { Service } from 'typedi';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@shared/logger';
import { config } from '@infrastructure/config';

export interface StorageOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  public?: boolean;
}

@Service()
export class StorageService {
  private storageDir: string;

  constructor() {
    // Use a local directory for storage in development
    this.storageDir = path.join(process.cwd(), 'storage');
    this.ensureStorageDir();
  }

  private async ensureStorageDir() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create storage directory', error as Error);
    }
  }

  /**
   * Store a file in the storage system
   */
  async storeFile(
    buffer: Buffer,
    filename: string,
    options: StorageOptions = {}
  ): Promise<string> {
    try {
      const filePath = path.join(this.storageDir, filename);
      await fs.writeFile(filePath, buffer);

      // In a real implementation, this would upload to cloud storage
      // and return a URL or file identifier

      return filename;
    } catch (error) {
      logger.error('Failed to store file', error as Error);
      throw new Error('Failed to store file');
    }
  }

  /**
   * Get a file from storage
   */
  async getFile(filename: string): Promise<Buffer> {
    try {
      const filePath = path.join(this.storageDir, filename);
      return await fs.readFile(filePath);
    } catch (error) {
      logger.error('Failed to get file', error as Error);
      throw new Error('File not found');
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = path.join(this.storageDir, filename);
      await fs.unlink(filePath);
    } catch (error) {
      logger.error('Failed to delete file', error as Error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get a public URL for a file
   */
  getPublicUrl(filename: string): string {
    // In a real implementation, this would generate a URL to access the file
    // For local development, we'll just return the filename
    return `/storage/${filename}`;
  }
}

export const storageService = new StorageService();
