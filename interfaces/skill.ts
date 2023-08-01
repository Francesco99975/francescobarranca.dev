import Platform from "./platform";
import Project from "./project";

export default interface Skill {
  id?: string;
  name: string;
  platform: string | null;
  subplatform: string | null;
  projects?: Project[];
}
