ALTER TABLE "task-card" ADD type TEXT;

INSERT INTO "task-card2" (id, title, taskTrackId, createrId, ownerId, taskBoardId, content, isDone, "index", created_at, updated_at)
SELECT id, title, taskListId, createrId, ownerId, taskWallId, content, isDone, "index", created_at, updated_at
FROM "task-card";

INSERT INTO "task-track2" (id, taskBoardId, "index", name, type)
SELECT id, taskWallId, "index", name, type
FROM "task-track";

INSERT INTO "group2" (id, taskBoardId, createrId, accessLevel)
SELECT id, taskWallId, userId, accessLevel
FROM "group";

INSERT INTO "task-board-setting" (id, taskBoardId) SELECT id FROM "task-board";
