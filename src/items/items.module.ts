import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [
    TypeOrmModule.forFeature([ Item ])
  ],
  exports: [
    ItemsService,
    TypeOrmModule //TypeOrmModule se exporta en caso de que se quiera acceso al repositorio, hacer un inject repository
  ]
})
export class ItemsModule {}
