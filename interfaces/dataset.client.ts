import { MONTHS } from "./constants";
import Visit from "./visit";

function months(config: any) {
  var cfg = config || {};
  var count = cfg.count || 12;
  var section = cfg.section;
  var values = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
}

function lastDay(month: number, year: number) {
  if (month == 1) {
    if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) return 29;
    else return 28;
  }

  if (month < 7) {
    return month % 2 === 0 ? 31 : 30;
  } else return month % 2 === 0 ? 30 : 31;
}

export enum DateFilter {
  ALL_TIME,
  LAST_12_MONTHS,
  YTD,
  LAST_MONTH,
  MTD,
  LAST_30_DAYS,
  LAST_7_DAYS,
  TODAY,
  REALTIME,
}

export interface RawDataset {
  title: string;
  callback?: (arr: any) => number;
  data: any;
}

export interface Dataset {
  title: string;
  labels: any;
  data: any;
}

export const allTime = (set: RawDataset): Dataset => {
  const dates: Date[] = set.data
    .map((visitor: Visit) => new Date(visitor.date))
    .sort((a: Date, b: Date) => new Date(a).getTime() - new Date(b).getTime());

  if (dates.length === 0) return { title: set.title, labels: [], data: [] };

  const initialDate = dates[0];

  const currentDate = new Date();

  const between = currentDate.getTime() - initialDate.getTime();
  const years = [];
  const ydata = [];
  if (between >= 31557600000 * 3) {
    for (
      let i = initialDate.getFullYear();
      i <= currentDate.getFullYear();
      i++
    ) {
      for (let j = initialDate.getMonth(); j < 12; j += 7) {
        if (j < 12) {
          years.push(`${months({ count: 12 })[j]} ${i}`);
          ydata.push(
            set.data.filter(
              (x: Visit) =>
                new Date(x.date).getMonth() === j &&
                new Date(x.date).getFullYear() === i
            ).length
          );
        }
      }
    }
    return { title: set.title, labels: years, data: ydata };
  } else if (between > 31557600000 && between < 31557600000 * 3) {
    for (
      let i = initialDate.getFullYear();
      i <= currentDate.getFullYear();
      i++
    ) {
      for (let j = initialDate.getMonth(); j < 12; j += 3) {
        if (j < 12) {
          years.push(`${months({ count: 12 })[j]} ${i}`);
          ydata.push(
            set.data.filter(
              (x: any) =>
                new Date(x.date).getMonth() === j &&
                new Date(x.date).getFullYear() === i
            ).length
          );
        }
      }
    }
    return { title: set.title, labels: years, data: ydata };
  } else {
    for (let j = initialDate.getMonth(); j >= 0; j -= 1) {
      if (j < 12) {
        years.push(`${months({ count: 12 })[j]} ${initialDate.getFullYear()}`);
        if (!set.callback) {
          ydata.push(
            set.data.filter(
              (x: any) =>
                new Date(x.date).getMonth() === j &&
                new Date(x.date).getFullYear() === initialDate.getFullYear()
            ).length
          );
        } else {
          ydata.push(
            set.callback(
              set.data.filter(
                (x: any) =>
                  new Date(x.date).getMonth() === j &&
                  new Date(x.date).getFullYear() === initialDate.getFullYear()
              )
            )
          );
        }
      }
    }
    return { title: set.title, labels: years.reverse(), data: ydata.reverse() };
  }
};

export const YTD = (set: RawDataset): Dataset => {
  const labels = months({ count: 12 });
  const tmp = set.data.filter(
    (x: any) => new Date(x.date).getFullYear() === new Date().getFullYear()
  );
  const ydata: any = [];

  labels.forEach((_, index) => {
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: any) => new Date(x.date).getMonth() === index).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: any) => new Date(x.date).getMonth() === index)
        )
      );
    }
  });
  return { title: set.title, labels, data: ydata };
};

export const last12Months = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => now.getTime() - new Date(x.date).getTime() <= 31557600000
  );
  const ydata: any = [];

  const Months = months({ count: 12 });

  for (let index = now.getMonth(); index !== now.getMonth() - 12; index--) {
    const mnx = index >= 0 ? index : 12 + index;
    labels.push(
      `${Months[mnx]} ${index >= 0 ? now.getFullYear() : now.getFullYear() - 1}`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => new Date(x.date).getMonth() === mnx).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => new Date(x.date).getMonth() === mnx)
        )
      );
    }
  }
  return { title: set.title, labels: labels.reverse(), data: ydata.reverse() };
};

export const lastMonth = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const Months = months({ count: 12 });
  const tmp = set.data.filter((x: any) => {
    const date = new Date(x.date);
    if (date.getMonth() !== 0) {
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() - 1
      );
    } else {
      return (
        date.getFullYear() === now.getFullYear() - 1 && date.getMonth() === 11
      );
    }
  });

  const ydata: any = [];

  for (let index = 1; index < 30; index++) {
    labels.push(
      `${index} ${
        now.getMonth() - 1 < 0 ? Months[11] : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === index &&
            date.getMonth() ===
              (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === index &&
              date.getMonth() ===
                (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels, data: ydata };
};

export const last30Days = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => now.getTime() - new Date(x.date).getTime() <= 2629800000
  );

  const Months = months({ count: 12 });
  const ydata: any = [];

  for (let index = now.getDate(); index !== now.getDate() - 30; index--) {
    const dnx =
      index > 0
        ? index
        : lastDay(now.getMonth() - 1, now.getFullYear()) + index;
    labels.push(
      `${dnx} ${
        index > 0
          ? Months[now.getMonth()]
          : now.getMonth() - 1 < 0
          ? Months[11]
          : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === dnx &&
            date.getMonth() ===
              (index > 0
                ? now.getMonth()
                : now.getMonth() - 1 < 0
                ? 11
                : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === dnx &&
              date.getMonth() ===
                (index > 0
                  ? now.getMonth()
                  : now.getMonth() - 1 < 0
                  ? 11
                  : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels: labels.reverse(), data: ydata.reverse() };
};

export const MTD = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => new Date(x.date).getMonth() === new Date().getMonth()
  );
  const Months = months({ count: 12 });
  const ydata: any = [];

  for (
    let index = 1;
    index < lastDay(now.getMonth() - 1, now.getFullYear());
    index++
  ) {
    labels.push(
      `${index} ${
        now.getMonth() - 1 < 0 ? Months[11] : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === index &&
            date.getMonth() ===
              (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === index &&
              date.getMonth() ===
                (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels, data: ydata };
};

export const last7Days = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => now.getTime() - new Date(x.date).getTime() <= 2629800000
  );

  const Months = months({ count: 12 });
  const ydata: any = [];

  for (let index = now.getDate(); index >= now.getDate() - 7; index--) {
    const dnx =
      index > 0
        ? index
        : lastDay(now.getMonth() - 1, now.getFullYear()) + index;
    labels.push(
      `${dnx} ${
        index > 0
          ? Months[now.getMonth()]
          : now.getMonth() - 1 < 0
          ? Months[11]
          : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === dnx &&
            date.getMonth() ===
              (index > 0
                ? now.getMonth()
                : now.getMonth() - 1 < 0
                ? 11
                : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === dnx &&
              date.getMonth() ===
                (index > 0
                  ? now.getMonth()
                  : now.getMonth() - 1 < 0
                  ? 11
                  : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels: labels.reverse(), data: ydata.reverse() };
};

export const today = (set: RawDataset): Dataset => {
  const now = new Date();
  const tmp = set.data.filter((x: any) => {
    const date = new Date(x.date);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  });

  const ydata: any = [];

  for (let index = 0; index < 22; index += 3) {
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return date.getHours() === index;
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return date.getHours() === index;
          })
        )
      );
    }
  }
  return {
    title: set.title,
    labels: [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ],
    data: ydata,
  };
};

export const realtime = (set: RawDataset): Dataset => {
  const now = new Date();
  const tmp = set.data.filter((x: any) => {
    const date = new Date(x.date);
    return date.getTime() - now.getTime() <= 1800000;
  });

  const ydata: any = [];

  for (let index = 30; index >= 2; index -= 4) {
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return date.getTime() - now.getTime() <= index * 60000;
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return date.getTime() - now.getTime() <= index * 60000;
          })
        )
      );
    }
  }

  return {
    title: set.title,
    labels: ["-30m", "-26m", "-22m", "-18m", "-14m", "-10m", "-6m", "-2m"],
    data: ydata,
  };
};
