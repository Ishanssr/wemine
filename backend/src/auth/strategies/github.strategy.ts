import { Injectable, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(@Optional() config?: ConfigService) {
    const clientID = config?.get('GITHUB_CLIENT_ID') || '__missing__';
    super({
      clientID,
      clientSecret: config?.get('GITHUB_CLIENT_SECRET') || '__missing__',
      callbackURL: config?.get('GITHUB_CALLBACK_URL') || 'http://localhost:4000/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { id, displayName, emails, photos } = profile;
    const user = {
      id,
      displayName,
      emails: emails || [{ value: `${id}@github.com` }],
      photos,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
