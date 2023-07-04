import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    await this.prisma.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  async findByAuthor(authorId: number) {
    return this.prisma.post.findMany({
      where: { authorId },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post #${id} not found.`);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    await this.prisma.post.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        ...updatePostDto,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.post.findUnique({ where: { id } });
    await this.prisma.post.delete({ where: { id } });
  }
}
