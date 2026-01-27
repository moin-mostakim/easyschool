import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../../../../../shared/src/interfaces/user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly jwtSecret: string;
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'secret';
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify token locally first
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      
      // Optionally verify with auth service for additional validation
      try {
        await firstValueFrom(
          this.httpService.get(`${this.authServiceUrl}/auth/validate`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        );
      } catch (error) {
        // If validation service is down, still allow if JWT is valid
        this.logger.warn('Auth service validation failed, using local JWT verification');
      }

      // Attach user to request
      request.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        schoolId: decoded.schoolId,
        permissions: decoded.permissions || [],
        accessToken: token,
      };

      return true;
    } catch (error) {
      this.logger.error('JWT validation failed', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
