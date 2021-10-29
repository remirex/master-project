import { Inject, Service } from 'typedi';
import slugify from 'slugify';
import mongoose from 'mongoose';
import { unlink } from 'fs';

import { ICreateCategoryDTO, IUpdateCategoryDTO } from '../interfaces/ICategory';
import CategoryWithThatNameAlreadyExistsException from '../api/exceptions/categories/CategoryWithThatNameAlreadyExistsException';
import CannotCreateRecordException from '../api/exceptions/CannotCreateRecordException';
import NotFoundException from '../api/exceptions/NotFoundException';
import WrongObjectIdException from '../api/exceptions/WrongObjectIdException';

@Service()
export default class CategoriesService {
  constructor(@Inject('categoryModel') private categoryModel: Models.CategoryModel, @Inject('logger') private logger) {}

  public async createCategory(createData: ICreateCategoryDTO) {
    const slugOfCategory = slugify(createData.name);
    const category = await this.categoryModel.findOne({ slug: slugOfCategory });
    if (category) throw new CategoryWithThatNameAlreadyExistsException(createData.name);

    const categoryRecord = await this.categoryModel.create({ ...createData });
    if (!categoryRecord) throw new CannotCreateRecordException();

    return true;
  }

  public async getAllCategories() {
    const categories = await this.categoryModel.find();
    if (!categories) throw new NotFoundException();

    return categories;
  }

  public async getCategory(categoryId: string) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const category = await this.categoryModel.findById(categoryId);
    if (!category) throw new NotFoundException();

    return category;
  }

  public async updateCategory(categoryId: string, updateData: IUpdateCategoryDTO) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const category = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      {
        ...updateData,
      },
      { new: true },
    );
    if (!category) throw new NotFoundException();

    return category;
  }

  public async deleteCategory(categoryId: string) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const category = await this.categoryModel.findByIdAndRemove(categoryId);
    if (!category) throw new NotFoundException();

    return true;
  }

  public async uploadCategoryImage(fileName: any, categoryId: string, basePath: string) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const findCategory = await this.categoryModel.findById(categoryId);
    if (!findCategory) throw new NotFoundException();

    const category = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      {
        image: basePath + '' + fileName,
      },
      { new: true },
    );
    if (!category) throw new NotFoundException();

    // unlink old file
    const image = findCategory.image;
    const separator = '/';
    const oldFile = CategoriesService.splitStr(image, separator);
    unlink(`public/uploads/${oldFile}`, err => {
      if (err) this.logger.error(err);
      this.logger.info(`Deleted file: ${oldFile}`);
    });

    return category;
  }

  // helpers
  private static isValid(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  private static splitStr(str, separator) {
    // Function to split string
    const string = str.split(separator);

    return string[string.length - 1];
  }
}
