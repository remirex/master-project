import { Inject, Service } from 'typedi';
import { Tags, Body, Post, Route, Put, Path, Get, Query, Delete } from 'tsoa';
import { IAttributeValueCreateDTO } from '../../../interfaces/IAttributeValue';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';
import { isValidObjectId } from '../../../utils/utils';
import WrongObjectIdException from '../../../api/exceptions/WrongObjectIdException';
import NotFoundException from '../../../api/exceptions/NotFoundException';
import { IAttributeValueUpdateDTO } from '../../../interfaces/IAttributeValue';

@Tags('Attribute Values')
@Route('/admin/attribute-value')
@Service()
export default class AttributeValueService {
  constructor(
    @Inject('attributeValueModel') private attributeValueModel: Models.AttributeValueModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination,
  ) {}

  /**
   * Create a new attribute value
   * @param createDto
   */
  @Post('/create')
  public async createAttributeValue(@Body() createDto: IAttributeValueCreateDTO) {
    const attributeValueRecord = await this.attributeValueModel.create({ ...createDto });
    if (!attributeValueRecord) throw new CannotCreateRecordException();

    return attributeValueRecord;
  }

  /**
   * Retrieve all attribute value from DB
   * @param page
   * @param limit
   */
  @Get('/all')
  public async getAllAttributeValues(@Query() page = 1, @Query() limit = 20) {
    return await this.pagination.paginate(this.attributeValueModel, page, limit, true, ['attribute']);
  }

  /**
   * Attribute value details
   * @param attributeValueId
   */
  @Get('/{attributeValueId}')
  public async getAttributeValue(@Path() attributeValueId: string) {
    const isValidId = isValidObjectId(attributeValueId);
    if (!isValidId) throw new WrongObjectIdException();

    const attributeValue = await this.attributeValueModel.findById(attributeValueId);
    if (!attributeValue) throw new NotFoundException();

    return attributeValue;
  }

  /**
   * Update attribute value
   * @param attributeValueId
   * @param updateData
   */
  @Put('/update/{attributeValueId}')
  public async updateAttributeValue(@Path() attributeValueId: string, @Body() updateData: IAttributeValueUpdateDTO) {
    const isValidId = isValidObjectId(attributeValueId);
    if (!isValidId) throw new WrongObjectIdException();

    const attributeValue = await this.attributeValueModel.findByIdAndUpdate(
      attributeValueId,
      {
        ...updateData,
      },
      { new: true },
    );
    if (!attributeValue) throw new NotFoundException();

    return attributeValue;
  }

  /**
   * Delete attribute value
   * @param attributeValueId
   */
  @Delete('/delete/{attributeValueId}')
  public async deleteAttributeValue(@Path() attributeValueId: string) {
    const isValidId = isValidObjectId(attributeValueId);
    if (!isValidId) throw new WrongObjectIdException();

    const attributeValue = await this.attributeValueModel.findByIdAndRemove(attributeValueId);
    if (!attributeValue) throw new NotFoundException();

    return attributeValue;
  }
}
