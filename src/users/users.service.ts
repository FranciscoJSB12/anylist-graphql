import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';


@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){}
  
  //Este método hay que exponerlo para usarlo en el auth, eso se hace en el user.module por medio de los exports como se muestra
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      });

      return await this.usersRepository.save(newUser);

    } catch (err) {
      this.handleDBErrors(err);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (err) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (err) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  block(id: string): Promise<User> {
    throw new Error(`block not implemented`);
  }

  private handleDBErrors(err: any): never {
    //never indica que una vez que entra no regresa nada, todos los caminos generan una excepción

    this.logger.error(err);
    
    if (err.code  === '23505') {
      throw new BadRequestException(err.detail.replace('Key ', ''));
    }

    throw new InternalServerErrorException('Please check server logs');
  }
}
