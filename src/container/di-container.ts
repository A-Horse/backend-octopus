import { MinioStorage } from 'src/storage/minio-storage';
import { ImageService } from 'src/service/image.service';
import { ProjectRepository } from '../domain/project/project-repository';
import { ProjectIssueApplicationService } from 'src/domain/project-issue/project-issue-application-service';

// simple design, implement it in feature
export class DIContainer {
  public minioStorage: MinioStorage;
  public imageService: ImageService;
  public projectRepository: ProjectRepository;
  public projectIssueApplicationService: ProjectIssueApplicationService;
}
