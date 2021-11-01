import { Path, Body, Get, Post, Tags, Route, Put, Delete, UploadedFile, Request } from 'tsoa';
import { Inject, Service } from 'typedi';
import slugify from 'slugify';
import mongoose from 'mongoose';
import { unlink } from 'fs';

import { ICreateCategoryDTO, IUpdateCategoryDTO } from '../../../interfaces/ICategory';
import CategoryWithThatNameAlreadyExistsException from '../../../api/exceptions/categories/CategoryWithThatNameAlreadyExistsException';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';
import NotFoundException from '../../../api/exceptions/NotFoundException';
import WrongObjectIdException from '../../../api/exceptions/WrongObjectIdException';

@Tags('Categories')
@Route('/admin/category')
@Service()
export default class CategoriesService {
  constructor(@Inject('categoryModel') private categoryModel: Models.CategoryModel, @Inject('logger') private logger) {}

  /**
   * Create new category
   * @param createData
   */
  @Post('/create')
  public async createCategory(@Body() createData: ICreateCategoryDTO) {
    const slugOfCategory = slugify(createData.name, { lower: true });
    const category = await this.categoryModel.findOne({ slug: slugOfCategory });
    if (category) throw new CategoryWithThatNameAlreadyExistsException(createData.name);

    const categoryRecord = await this.categoryModel.create({ ...createData });
    if (!categoryRecord) throw new CannotCreateRecordException();

    return true;
  }

  /**
   * Return all categories from DB
   */
  @Get('/all')
  public async getAllCategories() {
    const categories = await this.categoryModel.find();
    if (!categories) throw new NotFoundException();

    return categories;
  }

  /**
   * Category details
   * @param categoryId
   */
  @Get('/{categoryId}')
  public async getCategory(@Path() categoryId: string) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const category = await this.categoryModel.findById(categoryId);
    if (!category) throw new NotFoundException();

    return category;
  }

  /**
   * Update category
   * @param categoryId
   * @param updateData
   */
  @Put('/update/{categoryId}')
  public async updateCategory(@Path() categoryId: string, @Body() updateData: IUpdateCategoryDTO) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const category = await this.categoryModel.findByIdAndUpdate(
      categoryId,
      {
        ...updateData,
        slug: slugify(updateData.name, { lower: true }),
      },
      { new: true },
    );
    if (!category) throw new NotFoundException();

    return category;
  }

  /**
   * Delete category
   * @param categoryId
   */
  @Delete('/delete/{categoryId}')
  public async deleteCategory(@Path() categoryId: string) {
    const isValidId = CategoriesService.isValid(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const category = await this.categoryModel.findByIdAndRemove(categoryId);
    if (!category) throw new NotFoundException();

    return true;
  }

  /**
   * Upload category image
   * @param fileName
   * @param categoryId
   * @param basePath
   * @param image
   */
  @Put('/image-upload/{categoryId}')
  public async uploadCategoryImage(
    @Request() fileName: any,
    @Path() categoryId: string,
    @Request() basePath: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
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
    const img = findCategory.image;
    const separator = '/';
    const oldFile = CategoriesService.splitStr(img, separator);
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
