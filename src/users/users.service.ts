import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { ObjectId } from "mongodb";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: MongoRepository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ _id: new ObjectId(id) });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.usersRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException("Usuario no encontrado");
    Object.assign(user, data, { updatedAt: new Date() });
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepo.deleteOne({ _id: new ObjectId(id) });
  }
}
