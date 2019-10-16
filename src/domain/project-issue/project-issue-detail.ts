import { ProjectCard } from "./project-issue";


export class ProjectIssueDetail extends ProjectCard {
    public content: string;


    public toJSON(): any {
        return {
            content: this.content
        }
    }

}