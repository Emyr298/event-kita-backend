import { Request, Response, NextFunction } from 'express';
import fbApp from '../../utils/firebaseApp';
import { User } from 'src/common/entities/user.entity';
import { NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfo, UserStatus } from 'src/common/interfaces/user';

export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userInfo: UserInfo = {
      status: UserStatus.guest,
    };
    const tokenHeader = req.headers.authorization;
    if (tokenHeader) {
      const token = tokenHeader.replace('Bearer ', '');
      let userId: string;
      try {
        userId = (await fbApp.auth().verifyIdToken(token)).uid;
      } catch (error) {
        userId = null;
      }
      const isLoggedIn = !!userId;
      if (isLoggedIn) {
        userInfo.status = UserStatus.loggedIn;
        const user = await this.usersRepository.findOneBy({
          id: userId,
        });
        if (user) {
          userInfo.status = UserStatus.profileSet;
          userInfo.information = user;
        }
      }
      req['user'] = userInfo;
      next();
    }
  }
}
