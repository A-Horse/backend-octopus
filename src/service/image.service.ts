import { Base64Entity } from 'src/orm/base64.entity';
import { getRepository } from 'typeorm';

export class ImageService {
  public async saveBase64Image(base64: string): Promise<number> {
    const base64Entity = new Base64Entity();
    base64Entity.value = base64;
    await getRepository(Base64Entity).save(base64Entity);
    return base64Entity.id;
  }
}
