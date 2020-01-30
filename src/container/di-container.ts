import { MinioStorage } from 'src/storage/minio-storage';
import { ImageService } from 'src/service/image.service';

// simple design, implement it in feature
export class DIContainer {
  public minioStorage: MinioStorage;
  public imageService: ImageService;
}
