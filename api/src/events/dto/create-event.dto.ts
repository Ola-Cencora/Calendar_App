export class CreateEventDto {
  title: string;
  description: string;
  userId: number | null;
  startDate: string;
  endDate: string;
}
