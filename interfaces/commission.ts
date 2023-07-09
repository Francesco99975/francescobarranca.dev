export default interface Commission {
  id: string;
  subject: string;
  description: string;
  theme: string;
  pages: number;
  pwa: boolean;
  static: boolean;
  accepted: boolean;
  completed: boolean;
}
