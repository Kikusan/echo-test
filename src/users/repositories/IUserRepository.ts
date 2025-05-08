export interface IUserRepository {
  get(): Promise<any[]>;
  getById(id: string): Promise<any>;
  register(user: any): Promise<any>;
  update(user: any): Promise<any>;
  delete(id: string): Promise<void>;
}
