import { BadRequestException } from "@nestjs/common";

export class CategoryNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: "Category not found",
      code: "CATEGORY_NOT_FOUND",
    });
  }
}
