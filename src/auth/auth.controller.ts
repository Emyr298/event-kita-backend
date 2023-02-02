import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { SetProfileDto } from './dto/setProfile.dto';
import { Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { TokenInfo, UserInfo, UserStatus } from 'src/common/interfaces/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  // Check user status
  @Get()
  async getUserInfo(@Req() req: Request) {
    return req['user'];
  }

  // Setup user profile
  @Post('set-profile')
  async setProfile(@Req() req: Request, @Body() data: SetProfileDto) {
    const userInfo: UserInfo = req['user'];
    const tokenInfo: TokenInfo = req['token'];
    if (userInfo.status !== UserStatus.loggedIn) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    } else {
      try {
        await this.usersService.create(
          tokenInfo.uid,
          data.firstName,
          data.lastName,
          tokenInfo.email,
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
    }
  }
}
