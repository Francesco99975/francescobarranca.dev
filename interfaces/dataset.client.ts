import { MONTHS } from "./constants";

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
