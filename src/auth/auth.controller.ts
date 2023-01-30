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
import { RegisterUserDto } from './dto/registerUser.dto';

@Controller('register')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserData(@Headers('authorization') token: string): Promise<User> {
    token = token.replace('Bearer ', '');
    const userId: string = await this.usersService.getUserIdFromToken(token);
    const user: User = await this.usersService.findOne(userId);
    if (user) {
      return user;
    } else {
      throw new HttpException(
        'User with corresponding token not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Email/Password and Google Registration is already handled in Firebase Auth
  @Post('register')
  async registerUser(
    @Headers('authorization') token: string,
    @Body() data: RegisterUserDto,
  ): Promise<User> {
    const user = await this.usersService.create(
      token,
      data.firstName,
      data.lastName,
      data.email,
      data.photoUrl,
    );
    return user;
  }
}
