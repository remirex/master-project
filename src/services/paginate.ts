import { Model } from 'mongoose';
import { PaginationResponse } from '../types/paginationResponse';

export default class PaginateService {
  public static async paginate(
    model: Model<any>,
    page: number,
    limit: number,
    withRelation: boolean,
    relationArray: string[],
  ) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {} as PaginationResponse;

    const countDocs = await model.countDocuments().exec();

    if (endIndex < countDocs) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    result.totalPages = Math.ceil(countDocs / limit);
    result.currentPage = page;

    result.data = withRelation
      ? await model.find().populate(relationArray).limit(limit).skip(startIndex)
      : await model.find().limit(limit).skip(startIndex);

    return result;
  }
}
