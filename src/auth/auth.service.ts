import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService
{
  public users = [];

  async register(email: string, pass: string)
  {
      const userExist = this.users.find(user => user.email === email);

      if (userExist)
      {
        return { message: 'User with this email already exists' };
      }

      const hashedPassword = await bcrypt.hash(pass, 12);

      this.users.push({id:Date.now().toString(), email:email, password:hashedPassword});

      return { message: 'User registered successfully' };
  }

}
