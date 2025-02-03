import { FILTER_DATE_OPTION } from "src/constants";

export function filterDate(dateParam) {
    let now = new Date();
    let today = new Date();
    console.log('today', today);
    switch (dateParam.option) {
      case FILTER_DATE_OPTION.CUSTOM:
        const after = new Date(dateParam.range.after);
        const before = new Date(dateParam.range.before);
        after.setUTCHours(0, 0, 0, 0);
        before.setUTCHours(23, 59, 59, 59);
        // console.log(before.getTime());
        // before.setTime(before.getTime() + 23 * 59 * 59 * 1000);
        console.log('after', after);
        console.log('before', before);
        return {
          $gte: after,
          $lte: before,
        };
      case FILTER_DATE_OPTION.PAST3MONTH:
        let past3Month = new Date(now.setMonth(now.getMonth() - 3));
        past3Month.setUTCHours(0, 0, 0, 0);
        past3Month.setDate(1);
        today.setUTCHours(0, 0, 0, 0);
        console.log('past3Month', past3Month);
        today.setDate(1);
        let lastDayOfPast3Month = today
        lastDayOfPast3Month.setDate(today.getDate() - 1);
        lastDayOfPast3Month.setUTCHours(23,59,59,59);
        console.log('lastDayOfPast3Month', lastDayOfPast3Month);
        return {
          $gte: past3Month,
          $lte: lastDayOfPast3Month,
        };
      case FILTER_DATE_OPTION.PASTMONTH:
        const pastMonth = new Date(now.setMonth(now.getMonth() - 1));
        pastMonth.setUTCHours(0, 0, 0, 0);
        today.setUTCHours(0, 0, 0, 0);
        pastMonth.setDate(1);
        today.setDate(1);
        console.log('pastMonth', pastMonth);
        let lastDayOfPastMonth = today
        lastDayOfPastMonth.setDate(today.getDate() - 1);
        lastDayOfPastMonth.setUTCHours(23,59,59,59);
        console.log('lastDayOfPastMonth', lastDayOfPastMonth);
        return {
          $gte: pastMonth,
          $lte: lastDayOfPastMonth,
        };
      case FILTER_DATE_OPTION.THISMONTH:
        console.log(new Date().getMonth());
        console.log(new Date().getFullYear());
        now.setMonth(now.getMonth());
        let startOfMonth = new Date(now.setDate(1));
        console.log(startOfMonth);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        today.setUTCHours(0, 0, 0, 0);
        console.log('startOfMonth', startOfMonth);
        today.setDate(1);
        today.setMonth(today.getMonth() + 1);
        today.setDate(0); 
        let lastDayOfThisMonth = today;
        lastDayOfThisMonth.setUTCHours(23,59,59,59);
        console.log('lastDayOfThisMonth', lastDayOfThisMonth);
        return {
          $gte: startOfMonth,
          $lte: lastDayOfThisMonth,
        };
      case FILTER_DATE_OPTION.TODAY:
        let todayBeforeMidNight = new Date(today.setUTCHours(23, 59, 59));
        let todayStartOfMidNight = new Date(today.setUTCHours(0, 0, 0, 0));
        console.log('todayBeforeMidNight', todayBeforeMidNight);
        console.log('todayStartOfMidNight', todayStartOfMidNight);
        return {
          $gte: todayStartOfMidNight,
          $lte: todayBeforeMidNight,
        };
      case FILTER_DATE_OPTION.YESTERDAY:
        let yesterday = new Date(today.setDate(today.getDate() - 1));
        let yesterdayStart = new Date(yesterday.setUTCHours(0, 0, 0, 0));
        let yesterdayBeforeMidNight = new Date(
          yesterday.setUTCHours(23, 59, 59, 59),
        );
        console.log('yesterdayStart', yesterdayStart);
        console.log('yesterdayBeforeMidNight', yesterdayBeforeMidNight);
        return {
          $gte: yesterdayStart,
          $lte: yesterdayBeforeMidNight,
        };
      default:
        return '';
    }
  }