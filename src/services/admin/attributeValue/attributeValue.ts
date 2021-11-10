import { Inject, Service } from 'typedi';
import { Tags, Body, Post, Route } from 'tsoa';
import { IAttributeValueCreateDTO } from '../../../interfaces/IAttributeValue';
import CannotCreateRecordException from '../../../api/exceptions/CannotCreateRecordException';

@Tags('Attribute Values')
@Route('/admin/attribute-value')
@Service()
export default class AttributeValueService {
  constructor(
    @Inject('attributeValueModel') private attributeValueModel: Models.AttributeValueModel,
    @Inject('logger') private logger,
    @Inject('pagination') private pagination,
  ) {}

  @Post('/create')
  public async createAttributeValue(@Body() createDto: IAttributeValueCreateDTO) {
    const attributeValueRecord = await this.attributeValueModel.create({ ...createDto });
    if (!attributeValueRecord) throw new CannotCreateRecordException();

    return attributeValueRecord;
  }
}
