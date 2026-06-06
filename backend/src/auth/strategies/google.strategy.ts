import { Injectable, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Optional() config?: ConfigService) {
    const clientID = config?.get('GOOGLE_CLIENT_ID') || '__missing__';
    super({
      clientID,
      clientSecret: config?.get('GOOGLE_CLIENT_SECRET') || '__missing__',
      callbackURL: config?.get('GOOGLE_CALLBACK_URL') || 'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (...args: any[]) => void,
  ) {
    const { id, name, emails, photos } = profile;
    const user = {
      id,
      displayName: name?.givenName
        ? `${name.givenName} ${name.familyName || ''}`
        : profile.displayName,
      name: { givenName: name?.givenName, familyName: name?.familyName },
      emails,
      photos,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
