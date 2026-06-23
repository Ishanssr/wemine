import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async getPrebooks(userId: string) {
    return this.prisma.prebook.findMany({
      where: { userId },
      include: {
        design: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            category: true,
            isPrebook: true,
            prebookPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async addAddress(userId: string, data: any) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.create({ data: { ...data, userId } });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    const addr = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!addr) throw new NotFoundException('Address not found');

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.address.update({ where: { id: addressId }, data });
  }

  async deleteAddress(userId: string, addressId: string) {
    const addr = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!addr) throw new NotFoundException('Address not found');
    return this.prisma.address.delete({ where: { id: addressId } });
  }
}
