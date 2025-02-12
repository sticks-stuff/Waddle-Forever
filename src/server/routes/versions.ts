import { GameVersion } from "../settings";

function getVersionDetails(version: GameVersion): {
  year: number,
  month: number,
  day: number
} {
  const year = version.slice(0, 4);
  const month = version.slice(5, 8);
  const day = version.slice(9, 11);
  let monthNum = 0;

  if (month === 'Jan') {
    monthNum = 1;
  } else if (month === 'Feb') {
    monthNum = 2;
  } else if (month === 'Mar') {
    monthNum = 3;
  } else if (month === 'Apr') {
    monthNum = 4;
  } else if (month === 'May') {
    monthNum = 5;
  } else if (month === 'Jun') {
    monthNum = 6;
  } else if (month === 'Jul') {
    monthNum = 7;
  } else if (month === 'Aug') {
    monthNum = 8;
  } else if (month === 'Sep') {
    monthNum = 9;
  } else if (month === 'Oct') {
    monthNum = 10;
  } else if (month === 'Nov') {
    monthNum = 11;
  } else if (month === 'Dec') {
    monthNum = 12;
  }

  return {
    year: Number(year),
    month: monthNum,
    day: Number(day)
  };
}

export function isGreater(left: GameVersion, right: GameVersion): boolean {
  const leftDetails = getVersionDetails(left);
  const rightDetails = getVersionDetails(right);

  const names: Array<'year' | 'month' | 'day'> = ['year', 'month', 'day']

  for (const name of names) {
    if (leftDetails[name] > rightDetails[name]) {
      return true;
    } else if (leftDetails[name] < rightDetails[name]) {
      return false;
    }
  }


  return false;
}

export function isGreaterOrEqual(left: GameVersion, right: GameVersion): boolean {
  return left === right || isGreater(left, right);
}

export function isLower(left: GameVersion, right: GameVersion) {
  return !isGreaterOrEqual(left, right);
}

export function isLowerOrEqual(left: GameVersion, right: GameVersion): boolean {
  return !isGreater(left, right)
}
