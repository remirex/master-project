import { Path, Body, Get, Post, Tags, Route, Put, Delete, UploadedFile, Request } from 'tsoa';
import { Inject, Service } from 'typedi';
import slugify from 'slugify';
import { unlink } from 'fs';
import { IBrandCreateDTO } from '../../../interfaces/IBrand';
import BrandWithThatNameAlreadyExistsException from '../../../api/exceptions/brands/BrandWithThatNameAlreadyExistsException';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';
import NotFoundException from '../../../api/exceptions/NotFoundException';
import { isValidObjectId } from '../../../utils/utils';
import WrongObjectIdException from '../../../api/exceptions/WrongObjectIdException';
import { IBrandUpdateDTO } from '../../../interfaces/IBrand';
import { splitStr } from '../../../utils/utils';
import { Query } from 'tsoa';

@Tags('Brands')
@Route('/admin/brand')
@Service()
export default class BrandService {
  constructor(
    @Inject('brandModel') private brandModel: Models.BrandModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination
  ) {}

  /**
   * Create new brand
   * @param createData
   */
  @Post('/create')
  public async createBrand(@Body() createData: IBrandCreateDTO) {
    const exist = await this.alreadyExist(createData.name, false);
    if (exist) throw new BrandWithThatNameAlreadyExistsException(createData.name);

    const brandRecord = await this.brandModel.create({ ...createData });
    if (!brandRecord) throw new CannotCreateRecordException();

    return brandRecord;
  }

  /**
   * Return all brands from DB
   */
  @Get('/all')
  public async getAllBrands(@Query() page: number, @Query() limit: number) {
    return await this.pagination.paginate(this.brandModel, page, limit);
  }

  /**
   * Brand details
   * @param brandId
   */
  @Get('/{brandId}')
  public async getBrand(@Path() brandId: string) {
    const isValidId = isValidObjectId(brandId);
    if (!isValidId) throw new WrongObjectIdException();

    const brand = await this.brandModel.findById(brandId);
    if (!brand) throw new NotFoundException();

    return brand;
  }

  /**
   * Update brand
   * @param brandId
   * @param updateData
   */
  @Put('/update/{brandId}')
  public async updateBrand(@Path() brandId: string, @Body() updateData: IBrandUpdateDTO) {
    const isValidId = isValidObjectId(brandId);
    if (!isValidId) throw new WrongObjectIdException();

    const exist = await this.alreadyExist(updateData.name, true);
    if (exist) throw new BrandWithThatNameAlreadyExistsException(updateData.name);

    const brand = await this.brandModel.findByIdAndUpdate(
      brandId,
      {
        ...updateData,
        slug: slugify(updateData.name, { lower: true }),
      },
      { new: true },
    );
    if (!brand) throw new NotFoundException();

    return brand;
  }

  /**
   * Delete brand
   * @param brandId
   */
  @Delete('/delete/{brandId}')
  public async deleteBrand(@Path() brandId: string) {
    const isValidId = isValidObjectId(brandId);
    if (!isValidId) throw new WrongObjectIdException();

    const brand = await this.brandModel.findByIdAndRemove(brandId);
    if (!brand) throw new NotFoundException();

    return true;
  }

  /**
   * Upload brand image
   * @param fileName
   * @param brandId
   * @param basePath
   * @param logo
   */
  @Put('/image-upload/{brandId}')
  public async uploadBrandImage(
    @Request() fileName: any,
    @Path() brandId: string,
    @Request() basePath: string,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    const isValidId = isValidObjectId(brandId);
    if (!isValidId) throw new WrongObjectIdException();

    const findBrand = await this.brandModel.findById(brandId);
    if (!findBrand) throw new NotFoundException();

    const brand = await this.brandModel.findByIdAndUpdate(
      brandId,
      {
        logo: basePath + '' + fileName,
      },
      { new: true },
    );
    if (!brand) throw new NotFoundException();

    // unlink old file
    const img = findBrand.logo;
    const separator = '/';
    const oldFile = splitStr(img, separator);
    unlink(`public/uploads/images/${oldFile}`, err => {
      if (err) this.logger.error(err);
      this.logger.info(`Deleted file: ${oldFile}`);
    });

    return brand;
  }

  // helpers
  private async alreadyExist(name: string, isUpdate: boolean) {
    const slug = slugify(name, { lower: true });
    const find = await this.brandModel.findOne({ slug: slug });
    return find && !isUpdate;
  }
}
