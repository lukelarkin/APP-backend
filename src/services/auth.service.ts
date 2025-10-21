import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import config from '../config';
import { RegisterDto, LoginDto } from '../types';
import { AppError } from '../utils/response';

export class AuthService {
  async register(data: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        archetype: data.archetype,
        timezone: data.timezone,
        bedtime: data.bedtime,
      },
      select: {
        id: true,
        email: true,
        archetype: true,
        timezone: true,
        bedtime: true,
        createdAt: true,
      },
    });

    // Create initial streaks
    await Promise.all([
      prisma.streak.create({
        data: {
          userId: user.id,
          type: 'self_led',
          current: 0,
          best: 0,
        },
      }),
      prisma.streak.create({
        data: {
          userId: user.id,
          type: 'abstinence',
          current: 0,
          best: 0,
        },
      }),
    ]);

    const tokens = await this.generateTokens(user);

    return { user, ...tokens };
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        archetype: user.archetype,
        timezone: user.timezone,
        bedtime: user.bedtime,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string };

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      const tokens = await this.generateTokens(storedToken.user);

      // Delete old refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      return tokens;
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(user: { id: string; email: string; archetype: string }) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, archetype: user.archetype },
      config.jwt.secret
    );

    const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
