export default interface Commission {
  id: string;
  subject: string;
  description: string;
  theme: string;
  pages: number;
  pwa: boolean;
  static: boolean;
  environs: string[];
  accepted: boolean;
  completed: boolean;
}
