import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
  constructor(private config: ConfigService) {}

  private getBaseUrl() {
    return this.config.get('BASE_URL') || 'https://wemine-api.onrender.com';
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req: any, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
          const name = uuidv4() + extname(file.originalname);
          cb(null, name);
        },
      }),
      fileFilter: (_req: any, file: Express.Multer.File, cb: (error: Error | null, accept: boolean) => void) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|avif)$/)) {
          cb(new BadRequestException('Only image files are allowed') as unknown as Error, false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file provided');
    const base = this.getBaseUrl();
    return { url: `${base}/uploads/${file.filename}`, filename: file.filename };
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req: any, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
          const name = uuidv4() + extname(file.originalname);
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImages(@UploadedFiles() files: any[]) {
    if (!files?.length) throw new BadRequestException('No files provided');
    const base = this.getBaseUrl();
    return files.map((f) => ({ url: `${base}/uploads/${f.filename}`, filename: f.filename }));
  }
}
