ALTER TABLE "task-card" ADD type TEXT;

INSERT INTO "task-card2" (id, title, taskTrackId, createrId, ownerId, taskBoardId, content, isDone, "index", created_at, updated_at)
SELECT id, title, taskListId, createrId, ownerId, taskWallId, content, isDone, "index", created_at, updated_at
FROM "task-card";


