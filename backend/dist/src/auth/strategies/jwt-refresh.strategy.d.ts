import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(config: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        sub: string;
        email: string;
        role: string;
    }>;
}
export {};
