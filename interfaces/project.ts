import { Skill } from "@prisma/client";

export default interface Project {
  id: string;
  title: string;
  description: string;
  commission: boolean;
  featured: boolean;
  skills: Skill[];
  imageUrls: string[];
  sourceCodeUrl: string;
  downloadUrl: string;
}
