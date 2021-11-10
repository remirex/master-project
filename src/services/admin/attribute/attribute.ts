import { Inject, Service } from 'typedi';
import { Tags, Body, Post, Route } from 'tsoa';

import { IAttributeCreateDTO } from '../../../interfaces/IAttribute';
import { alreadyExist } from '../../../utils/utils';
import AttributeWithThatCodeAlreadyExistsException from '../../../api/exceptions/attribute/AttributeWithThatCodeAlreadyExistsException';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';

@Tags('Attributes')
@Route('/admin/attribute')
@Service()
export default class AttributeService {
  constructor(
    @Inject('attributeModel') private attributeModel: Models.AttributeModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination,
  ) {}

  @Post('/create')
  public async createAttribute(@Body() createData: IAttributeCreateDTO) {
    const exist = await alreadyExist(this.attributeModel, createData.code, false);
    if (exist) throw new AttributeWithThatCodeAlreadyExistsException(createData.code);

    const attributeRecord = await this.attributeModel.create({ ...createData });
    if (!attributeRecord) throw new CannotCreateRecordException();

    return attributeRecord;
  }
}
