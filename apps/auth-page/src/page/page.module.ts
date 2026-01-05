import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports:[AuthModule, DatabaseModule],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
