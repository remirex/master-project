import { Path, Body, Get, Post, Tags, Route, Put, Delete, UploadedFile, Request } from 'tsoa';
import { Inject, Service } from 'typedi';
import slugify from 'slugify';
import { unlink } from 'fs';

import { ICreateCategoryDTO, IUpdateCategoryDTO } from '../../../interfaces/ICategory';
import CategoryWithThatNameAlreadyExistsException from '../../../api/exceptions/categories/CategoryWithThatNameAlreadyExistsException';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';
import NotFoundException from '../../../api/exceptions/NotFoundException';
import WrongObjectIdException from '../../../api/exceptions/WrongObjectIdException';
import { isValidObjectId } from '../../../utils/utils';
import { splitStr } from '../../../utils/utils';
import { Query } from 'tsoa';

@Tags('Categories')
@Route('/admin/category')
@Service()
export default class CategoriesService {
  constructor(
    @Inject('categoryModel') private categoryModel: Models.CategoryModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination,
  ) {}

  /**
   * Create new category
   * @param createData
   */
  @Post('/create')
  public async createCategory(@Body() createData: ICreateCategoryDTO) {
    const exist = await this.alreadyExist(createData.name, false);
    if (exist) throw new CategoryWithThatNameAlreadyExistsException(createData.name);

    const categoryRecord = await this.categoryModel.create({ ...createData });
    if (!categoryRecord) throw new CannotCreateRecordException();

    return categoryRecord;
  }

  /**
   * Return all categories from DB
   */
  @Get('/all')
  public async getAllCategories(@Query() page = 1, @Query() limit = 20) {
    return await this.pagination.paginate(this.categoryModel, page, limit);
  }

  /**
   * Category details
   * @param categoryId
   */
  @Get('/{categoryId}')
  public async getCategory(@Path() categoryId: string) {
    const isValidId = isValidObjectId(categoryId);
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
    const isValidId = isValidObjectId(categoryId);
    if (!isValidId) throw new WrongObjectIdException();

    const exist = await this.alreadyExist(updateData.name, true);
    if (exist) throw new CategoryWithThatNameAlreadyExistsException(updateData.name);

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
    const isValidId = isValidObjectId(categoryId);
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
    const isValidId = isValidObjectId(categoryId);
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
    const oldFile = splitStr(img, separator);
    unlink(`public/uploads/images/${oldFile}`, err => {
      if (err) this.logger.error(err);
      this.logger.info(`Deleted file: ${oldFile}`);
    });

    return category;
  }

  // helpers
  private async alreadyExist(name: string, isUpdate: boolean) {
    const slug = slugify(name, { lower: true });
    const find = await this.categoryModel.findOne({ slug: slug });
    return find && !isUpdate;
  }
}
