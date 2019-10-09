import { JSONEntity } from "../interface/json";


export class ProjectIssueDetail implements JSONEntity {
    public content: string;


    public toJSON(): any {
        return {
            content: this.content
        }
    }

}