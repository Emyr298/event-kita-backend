import {
  Headers,
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { User } from 'src/common/entities/user.entity';
import { UsersService } from './services/users.service';
import { SetProfileDto } from './dto/setProfile.dto';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  // Check user status
  @Get()
  async getUserInfo(@Headers('authorization') token: string) {
    let status = 'guest';
    if (!token) {
      throw new HttpException('Token is empty', HttpStatus.BAD_REQUEST);
    }
    token = token.replace('Bearer ', '');
    const userId: string = await this.usersService.getUserIdFromToken(token);
    const isLoggedIn = !!userId;
    if (isLoggedIn) {
      status = 'logged in';
      const user: User = await this.usersService.findOne(userId);
      if (user) {
        status = 'logged in profile set';
        return {
          status: status,
          information: user,
        };
      }
    }
    return {
      status: status,
    };
  }

  // Setup user profile
  @Post('set-profile')
  async setProfile(
    @Headers('authorization') token: string,
    @Body() data: SetProfileDto,
  ) {
    if (!token) {
      throw new HttpException('Token is empty', HttpStatus.FORBIDDEN);
    }
    token = token.replace('Bearer ', '');
    const user: DecodedIdToken = await this.usersService.decodeToken(token);
    if (user) {
      const isExists = (await this.usersService.findOne(user.uid)) != null;
      if (!isExists) {
        try {
          await this.usersService.create(
            user.uid,
            data.firstName,
            data.lastName,
            user.email,
            data.photoUrl,
          );
          return {
            status: 'success',
          };
        } catch (error) {
          throw new HttpException(
            'Cannot create new user',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Token is not valid', HttpStatus.FORBIDDEN);
    }
  }
}
