import { UserModel } from '../model/user';
import { UserEntity } from '../entity/user.entity';
import { getRepository } from 'typeorm';
import { TodoModel } from '../model/todo.model';
import { Todo } from '../entity/todo.entity';
import { TaskBoardModel } from '../model/task-board';
import { TaskBoardSettingModel } from '../model/task-board-setting.model';
import { createTaskBoard, saveTaskBoard } from '../app/task/task-board.app';
import { TaskTrackModel } from '../model/task-track';
import { createTrack } from '../app/task/task-track.app';
import { from, range } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { TaskCardModel } from '../model/task-card';
import { createTaskCard } from '../app/task/task-card.app';
import { TaskCardType } from '../typing/task-card.typing';

export async function migrationUser() {
  const users = await new UserModel().fetchAll();
  users.forEach(async (user: UserModel) => {
    const newUser = new UserEntity();

    newUser.id = user.get('id');
    newUser.hash = user.get('password');
    newUser.email = user.get('email');
    newUser.username = user.get('username');

    await getRepository(UserEntity).save(newUser);
  });
}

export async function migrationTodo() {
  const todos = await new TodoModel().fetchAll();

  todos
    .filter(todo => todo.get('content'))
    .forEach(async (todo: UserModel) => {
      const newTodo = new Todo();

      const creator = new UserEntity();
      creator.id = todo.get('userId');

      newTodo.creator = creator;

      newTodo.content = todo.get('content');
      newTodo.deadline = todo.get('deadline')
        ? new Date(todo.get('deadline'))
        : undefined;
      newTodo.status = todo.get('isDone') ? 'DONE' : 'ACTIVE';
      newTodo.isDelete = todo.get('isDelete') ? true : false;

      await getRepository(Todo).save(newTodo);
    });
}

export async function migrationTask(): Promise<void> {
  const taskBoards = await new TaskBoardModel().fetchAll();

  await Promise.all(
    taskBoards.map(async (taskBoard: any) => {
      const taskBoardSetting = await TaskBoardSettingModel.where({
        boardId: taskBoard.id
      }).fetch();

      const taskBoardDomain = createTaskBoard(
        taskBoard.get('ownerId'),
        taskBoard.get('name'),
        taskBoard.get('description'),
        taskBoardSetting.get('showType')
      );
      await saveTaskBoard(taskBoardDomain);

      const tracks = await TaskTrackModel.where({
        taskBoardId: taskBoard.id
      }).fetchAll();

      const trackDatas = tracks.map(t => {
        return {
          id: t.id,
          name: t.get('name')
        };
      });

      await new Promise(resolve => {
        range(0, trackDatas.length)
          .pipe(
            concatMap(index => {
              return from(
                new Promise(resolve2 => {
                  createTrack({
                    name: trackDatas[index].name,
                    desc: '',
                    creatorId: taskBoard.get('ownerId'),
                    boardId: taskBoardDomain.id
                  }).then(trackData => {
                    TaskCardModel
                      .where({
                        taskTrackId: trackDatas[index].id
                      })
                      .fetchAll().then(cards => {
                        const cardDatas = cards.map(c => {
                          return {
                            id: c.id,
                            title: c.get('title'),
                            type: c.get('type')
                          };
                        });

                        range(0, cardDatas.length)
                          .pipe(
                            concatMap(index2 => {
                              return from(
                                new Promise(resolve3 => {
                                  createTaskCard({
                                    title: cardDatas[index2].title,
                                    boardId: taskBoard.id,
                                    trackId: trackData.id,
                                    type: cardDatas[index2].type || TaskCardType.NORMAL,
                                    creatorId: taskBoard.get('ownerId')
                                  }).then(() => {
                                    resolve3();
                                  });
                                })
                              );
                            })
                          )
                          .subscribe({
                            complete: () => {
                              resolve2();
                            }
                          });
                      });
                  });
                })
              );
            })
          )
          .subscribe({
            complete: () => {
              resolve();
            }
          });
      });
    })
  );
}
