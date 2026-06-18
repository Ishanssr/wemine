import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Roles(Role.ADMIN)
@Controller('upload')
export class UploadController {
  private cloudinary: any;

  constructor(private config: ConfigService) {
    if (this.config.get('CLOUDINARY_CLOUD_NAME')) {
      this.cloudinary = cloudinary.v2;
      this.cloudinary.config({
        cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key: this.config.get('CLOUDINARY_API_KEY'),
        api_secret: this.config.get('CLOUDINARY_API_SECRET'),
      });
    }
  }

  private getBaseUrl() {
    return this.config.get('BASE_URL') || 'https://wemine-api.onrender.com';
  }

  async uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.cloudinary) {
        reject(new Error('Cloudinary not configured'));
        return;
      }
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (err: any, result: any) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        },
      );
      uploadStream.end(buffer);
    });
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file provided');

    if (this.cloudinary) {
      const url = await this.uploadToCloudinary(file.buffer, 'wemine');
      return { url, filename: url.split('/').pop() };
    }

    // Fallback to local disk if Cloudinary not configured
    const { diskStorage } = require('multer');
    const { extname } = require('path');
    const { v4: uuidv4 } = require('uuid');
    const fs = require('fs');
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const name = uuidv4() + extname(file.originalname);
    fs.writeFileSync(`${dir}/${name}`, file.buffer);
    const base = this.getBaseUrl();
    return { url: `${base}/uploads/${name}`, filename: name };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
  async uploadImages(@UploadedFiles() files: any[]) {
    if (!files?.length) throw new BadRequestException('No files provided');

    if (this.cloudinary) {
      const results = await Promise.all(
        files.map((f: any) => this.uploadToCloudinary(f.buffer, 'wemine')),
      );
      return results.map((url) => ({ url, filename: url.split('/').pop() }));
    }

    // Fallback to local disk
    const { diskStorage } = require('multer');
    const { extname } = require('path');
    const { v4: uuidv4 } = require('uuid');
    const fs = require('fs');
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const base = this.getBaseUrl();
    return files.map((f: any) => {
      const name = uuidv4() + extname(f.originalname);
      fs.writeFileSync(`${dir}/${name}`, f.buffer);
      return { url: `${base}/uploads/${name}`, filename: name };
    });
  }
}
