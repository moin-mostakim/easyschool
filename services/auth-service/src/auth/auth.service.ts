import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { LoginDto, RegisterDto } from '../../../../shared/src/dto/auth.dto';
import { UserRole as UserRoleEnum, Permission } from '../../../../shared/src/enums/roles.enum';
import { JwtPayload } from '../../../../shared/src/interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.initializeRoles();
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const permissions = this.getUserPermissions(user);
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: this.getPrimaryRole(user) as UserRoleEnum,
      schoolId: user.schoolId,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d') },
    );

    // Store refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: payload.role,
        schoolId: user.schoolId,
        permissions,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      schoolId: registerDto.schoolId,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign role
    const role = await this.roleRepository.findOne({
      where: { name: registerDto.role },
    });

    if (role) {
      const userRole = this.userRoleRepository.create({
        userId: savedUser.id,
        roleId: role.id,
        schoolId: registerDto.schoolId,
      });
      await this.userRoleRepository.save(userRole);
    }

    this.logger.log(`User registered: ${registerDto.email}`);

    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: registerDto.role,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken) as { userId: string };
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
        relations: ['userRoles', 'userRoles.role'],
      });

      if (!user || !user.isActive || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const permissions = this.getUserPermissions(user);
      const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: this.getPrimaryRole(user) as UserRoleEnum,
        schoolId: user.schoolId,
        permissions,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: payload.role,
          schoolId: user.schoolId,
          permissions,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getProfile(user: any) {
    const fullUser = await this.userRepository.findOne({
      where: { id: user.userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    const permissions = this.getUserPermissions(fullUser);

    return {
      id: fullUser.id,
      email: fullUser.email,
      firstName: fullUser.firstName,
      lastName: fullUser.lastName,
      phone: fullUser.phone,
      role: this.getPrimaryRole(fullUser),
      schoolId: fullUser.schoolId,
      permissions,
      lastLoginAt: fullUser.lastLoginAt,
    };
  }

  private getUserPermissions(user: User): Permission[] {
    const permissions = new Set<Permission>();
    
    if (user.userRoles) {
      user.userRoles.forEach((userRole) => {
        if (userRole.role && userRole.role.permissions) {
          userRole.role.permissions.forEach((permission) => {
            permissions.add(permission as Permission);
          });
        }
      });
    }

    return Array.from(permissions);
  }

  private getPrimaryRole(user: User): string {
    if (user.userRoles && user.userRoles.length > 0) {
      return user.userRoles[0].role.name;
    }
    return UserRoleEnum.STUDENT;
  }

  private async initializeRoles() {
    const roles = [
      {
        name: UserRoleEnum.SUPER_ADMIN,
        permissions: [
          Permission.MANAGE_ALL_SCHOOLS,
          Permission.APPROVE_SCHOOLS,
          Permission.SUSPEND_SCHOOLS,
          Permission.MANAGE_SUBSCRIPTIONS,
          Permission.VIEW_SYSTEM_ANALYTICS,
        ],
      },
      {
        name: UserRoleEnum.SCHOOL_ADMIN,
        permissions: [
          Permission.MANAGE_SCHOOL_PROFILE,
          Permission.MANAGE_CLASSES,
          Permission.MANAGE_SECTIONS,
          Permission.MANAGE_SUBJECTS,
          Permission.MANAGE_STUDENTS,
          Permission.MANAGE_TEACHERS,
          Permission.MANAGE_STAFF,
          Permission.VIEW_ATTENDANCE,
          Permission.MANAGE_EXAMS,
          Permission.MANAGE_RESULTS,
          Permission.MANAGE_FEES,
          Permission.SEND_NOTICES,
        ],
      },
      {
        name: UserRoleEnum.TEACHER,
        permissions: [
          Permission.TAKE_ATTENDANCE,
          Permission.UPLOAD_HOMEWORK,
          Permission.UPLOAD_MATERIALS,
          Permission.ENTER_EXAM_MARKS,
          Permission.SEND_CLASS_NOTICES,
          Permission.COMMUNICATE_PARENTS,
          Permission.VIEW_ASSIGNED_CLASSES,
          Permission.VIEW_STUDENT_DATA,
        ],
      },
      {
        name: UserRoleEnum.PARENT,
        permissions: [
          Permission.VIEW_CHILD_ATTENDANCE,
          Permission.VIEW_HOMEWORK,
          Permission.VIEW_NOTICES,
          Permission.VIEW_EXAM_RESULTS,
          Permission.VIEW_PERFORMANCE,
          Permission.VIEW_FEES,
          Permission.COMMUNICATE_TEACHERS,
        ],
      },
      {
        name: UserRoleEnum.STUDENT,
        permissions: [
          Permission.VIEW_OWN_HOMEWORK,
          Permission.VIEW_OWN_RESULTS,
          Permission.VIEW_CLASS_ROUTINE,
          Permission.VIEW_OWN_NOTICES,
        ],
      },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create({
          name: roleData.name,
          permissions: roleData.permissions,
        });
        await this.roleRepository.save(role);
        this.logger.log(`Initialized role: ${roleData.name}`);
      }
    }
  }
}
