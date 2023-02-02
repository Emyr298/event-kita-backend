import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import fbApp from 'src/common/utils/firebaseApp';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async create(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    photoUrl: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      photo_url: photoUrl,
      register_time: new Date(),
    });
    const newUser = await this.usersRepository.save(user);
    return newUser;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete({ id: id });
  }

  async getUserIdFromToken(token: string): Promise<string> {
    try {
      const decodedIdToken: DecodedIdToken = await fbApp
        .auth()
        .verifyIdToken(token);
      const userId = decodedIdToken.uid;
      return userId;
    } catch {
      return null;
    }
  }

  async decodeToken(token: string): Promise<DecodedIdToken> {
    try {
      const decodedIdToken: DecodedIdToken = await fbApp
        .auth()
        .verifyIdToken(token);
      const user = decodedIdToken;
      return user;
    } catch {
      return null;
    }
  }
}
