export interface Vitals {
  href: string;
  name: string;
  value: number;
  rating: string;
  delta: number;
  entries: Entry[];
  id: string;
  navigationType: string;
}

export interface Entry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  size: number;
  renderTime: number;
  loadTime: number;
  firstAnimatedFrameTime: number;
  id: string;
  url: string;
}
