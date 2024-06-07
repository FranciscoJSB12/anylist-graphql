import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item) // este decorador injectrepositorio es necesario para que pueda funcionarl item repository
    private readonly itemsRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepository.create(createItemInput);
    return this.itemsRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: string) {
    const item = await this.itemsRepository.findOneBy({ id });

    if (!item) throw new NotFoundException(`Item with id ${id} not found`);

    return item;
  }

  async update(updateItemInput: UpdateItemInput):Promise<Item> {
    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException(`Item with id ${updateItemInput.id} not found`);
    
    return this.itemsRepository.save(item);
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
