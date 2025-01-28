import { CreateEventDto } from './create-event.dto';
import { PartialType } from '@nestjs/mapped-types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateEventDto extends PartialType(CreateEventDto) {}
