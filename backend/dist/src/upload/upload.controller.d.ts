export declare class UploadController {
    uploadImage(file: any): Promise<{
        url: string;
        filename: any;
    }>;
    uploadImages(files: any[]): Promise<{
        url: string;
        filename: any;
    }[]>;
}
