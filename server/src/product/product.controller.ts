import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }

  @Post()
  async createProduct(@Body() data: Product) {
    return this.productService.createProduct(data);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() data: Product) {
    return this.productService.updateProduct(Number(id), data);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}
