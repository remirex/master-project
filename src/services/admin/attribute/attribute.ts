import { Inject, Service } from 'typedi';
import { Tags, Body, Post, Route, Get, Query, Path, Put, Delete } from 'tsoa';

import { isExist } from '../../../utils/utils';
import { isValidObjectId } from '../../../utils/utils';
import { IAttributeCreateDTO } from '../../../interfaces/IAttribute';
import AttributeWithThatCodeAlreadyExistsException from '../../../api/exceptions/attribute/AttributeWithThatCodeAlreadyExistsException';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';
import WrongObjectIdException from '../../../api/exceptions/WrongObjectIdException';
import NotFoundException from '../../../api/exceptions/NotFoundException';
import { IAttributeUpdateDTO } from '../../../interfaces/IAttribute';
import slugify from 'slugify';

@Tags('Attributes')
@Route('/admin/attribute')
@Service()
export default class AttributeService {
  constructor(
    @Inject('attributeModel') private attributeModel: Models.AttributeModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination,
  ) {}

  /**
   * Create new attribute
   * @param createData
   */
  @Post('/create')
  public async createAttribute(@Body() createData: IAttributeCreateDTO) {
    const exist = await isExist(this.attributeModel, false, true, 'code', createData.code);
    if (exist) throw new AttributeWithThatCodeAlreadyExistsException(createData.code);

    const attributeRecord = await this.attributeModel.create({ ...createData });
    if (!attributeRecord) throw new CannotCreateRecordException();

    return attributeRecord;
  }

  /**
   * Retrieve all attributes from DB
   * @param page
   * @param limit
   */
  @Get('/all')
  public async getAllAttributes(@Query() page = 1, @Query() limit = 20) {
    return await this.pagination.paginate(this.attributeModel, page, limit, false, []);
  }

  /**
   * Attribute details
   * @param attributeId
   * @constructor
   */
  @Get('/{attributeId}')
  public async GetAttribute(@Path() attributeId: string) {
    const isValidId = isValidObjectId(attributeId);
    if (!isValidId) throw new WrongObjectIdException();

    const attribute = await this.attributeModel.findById(attributeId);
    if (!attribute) throw new NotFoundException();

    return attribute;
  }

  /**
   * Update attribute
   * @param attributeId
   * @param updateData
   */
  @Put('/update/{attributeId}')
  public async updateAttribute(@Path() attributeId: string, @Body() updateData: IAttributeUpdateDTO) {
    const isValidId = isValidObjectId(attributeId);
    if (!isValidId) throw new WrongObjectIdException();

    const exist = await isExist(this.attributeModel, true, true, 'code', updateData.code);
    if (exist) throw new AttributeWithThatCodeAlreadyExistsException(updateData.code);

    const attribute = await this.attributeModel.findByIdAndUpdate(
      attributeId,
      {
        ...updateData,
        code: slugify(updateData.code, { lower: true }),
      },
      { new: true },
    );
    if (!attribute) throw new NotFoundException();

    return attribute;
  }

  /**
   * Delete attribute
   * @param attributeId
   */
  @Delete('/delete/{attributeId}')
  public async deleteAttribute(@Path() attributeId: string) {
    const isValidId = isValidObjectId(attributeId);
    if (!isValidId) throw new WrongObjectIdException();

    const attribute = await this.attributeModel.findByIdAndRemove(attributeId);
    if (!attribute) throw new NotFoundException();

    return true;
  }
}
