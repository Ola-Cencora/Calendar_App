import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { DatabaseModule } from './database/database.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';

@Module({
  imports: [EventsModule, DatabaseModule, CalendarEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
