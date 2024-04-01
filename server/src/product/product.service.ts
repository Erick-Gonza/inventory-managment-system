import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: number;
  supplierId: number;
}

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {
    this.prisma = prisma;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async getProductById(id: number): Promise<Product> {
    const searchProduct = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        supplier: true,
      },
    });
    if (!searchProduct)
      throw new NotFoundException('The product does not exist');
    return searchProduct;
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    const { name, description, price, quantity, categoryId, supplierId } = data;
    try {
      return await this.prisma.product.create({
        data: {
          name,
          description,
          price,
          quantity,
          category: { connect: { id: categoryId } },
          supplier: { connect: { id: supplierId } },
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProduct(id: number, data: Product): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw new NotFoundException('The product to be updated does not exist');
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    try {
      return await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException('The product to be removed does not exist');
    }
  }
}
