import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  getCurrentTime() {
    return Math.floor(new Date().getTime() / 1000);
  }
  // GET End of Day time by date
  getEodDate(date: number) {
    const actualDate = new Date(date * 1000);
    const endOfDayDate = new Date(
      actualDate.getFullYear(),
      actualDate.getMonth(),
      actualDate.getDate(),
      23,
      59,
      59,
    ).getTime();
    return Math.floor(endOfDayDate / 1000);
  }
}
