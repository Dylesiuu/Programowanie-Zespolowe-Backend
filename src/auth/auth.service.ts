import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService
{
  public users = [];

  async register(createUserDto: CreateUserDto)
  {
    const { email, password, name, lastname } = createUserDto;

    const userExist = this.users.find((user) => user.email === email);

    if (userExist)
       {
        return { message: 'User with this email already exists' };
      }

      const hashedpassword = await bcrypt.hash(password, 12);

      this.users.push({id:Date.now().toString(), name:name, lastname:lastname, email:email, password:hashedpassword});

      return { message: 'User registered successfully' };
  }
}
