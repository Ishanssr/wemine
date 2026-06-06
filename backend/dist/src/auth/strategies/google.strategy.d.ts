import { ConfigService } from '@nestjs/config';
declare const GoogleStrategy_base: new (...args: any[]) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor(config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (...args: any[]) => void): Promise<void>;
}
export {};
