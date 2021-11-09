import { Inject, Service } from 'typedi';
import { Tags, Route, Body, Path } from 'tsoa';
import { Post } from 'tsoa';

import { IProductCreateDTO } from '../../../interfaces/IProduct';
import NotFoundException from '../../../api/exceptions/NotFoundException';
import { alreadyExist } from '../../../utils/utils';
import ProductWithThatNameAlreadyExistsException from '../../../api/exceptions/products/ProductWithThatNameAlreadyExistsException';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';
import { isValidObjectId } from '../../../utils/utils';
import WrongObjectIdException from '../../../api/exceptions/WrongObjectIdException';
import { Get } from 'tsoa';
import { Query } from 'tsoa';

@Tags('Products')
@Route('/admin/product')
@Service()
export default class ProductService {
  constructor(
    @Inject('productModel') private productModel: Models.ProductModel,
    @Inject('categoryModel') private categoryModel: Models.CategoryModel,
    @Inject('brandModel') private brandModel: Models.BrandModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination,
  ) {}

  @Post('/create')
  public async createProduct(@Body() createData: IProductCreateDTO) {
    const validCategoryId = isValidObjectId(createData.category);
    if (!validCategoryId) throw new WrongObjectIdException('Category id is not valid.');

    const category = await this.categoryModel.findById(createData.category);
    if (!category) throw new NotFoundException();

    const validBrandId = isValidObjectId(createData.brand);
    if (!validBrandId) throw new WrongObjectIdException('Brand id is not valid');

    const brand = await this.brandModel.findById(createData.brand);
    if (!brand) throw new NotFoundException();

    const exist = await alreadyExist(this.productModel, createData.name, false);
    if (exist) throw new ProductWithThatNameAlreadyExistsException(createData.name);

    const productRecord = await this.productModel.create({ ...createData });
    if (!productRecord) throw new CannotCreateRecordException();

    return productRecord;
  }

  @Get('/all')
  public async getAllProducts(@Query() page = 1, @Query() limit = 20) {
    return await this.pagination.paginate(this.productModel, page, limit, true, ['brand', 'category']);
  }

  @Get('/{productId}')
  public async getProduct(@Path() productId: string) {
    const isValidId = isValidObjectId(productId);
    if (!isValidId) throw new WrongObjectIdException('Product id is not valid');

    const product = await this.productModel.findById(productId)
      .populate(['brand', 'category'])
    if (!product) throw new NotFoundException();

    return product;
  }
}
