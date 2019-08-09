import { ProjectSettingEntity } from './../../../entity/project-setting.entity';

export class ProjectSetting {
    private id: string;
    public cover: string;
    public coverUri: string;

    constructor({id, cover}) {
        this.id = id;
        this.cover = cover;
    }

    static fromDataEntity(dataEntity: ProjectSettingEntity): ProjectSetting {
        return new ProjectSetting({
            id: dataEntity.id,
            cover: dataEntity.cover
        });
    }
}