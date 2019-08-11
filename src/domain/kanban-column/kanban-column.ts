import { KanbanColumnStatus } from './../../typing/kanban-column.typing';
import { KanbanColumnEntity } from './../../entity/kanban-column.entity';

export class kanbanColumn {
    public id: string;
    public name: string;
    public status: KanbanColumnStatus;
    public creatorId: string;
    public order: number;
    public createdAt: Date;
    public udpatedAt: Date;

    constructor({
        id,
        name,
        status,
        creatorId,
        order,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.creatorId = creatorId;
        this.order = order;
        this.createdAt =createdAt;
        this.udpatedAt = updatedAt;
    }

    static fromDataEntity(dataEntity: KanbanColumnEntity): kanbanColumn {
        return new kanbanColumn({
            id: dataEntity.id,
            name: dataEntity.name,
            status: dataEntity.status,
            creatorId: dataEntity.creator.id,
            order: dataEntity.order,
            createdAt: dataEntity.createdAt,
            updatedAt: dataEntity.updatedAt            
        })
    }
}