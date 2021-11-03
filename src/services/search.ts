import { Service, Inject } from 'typedi';
import elastic from './elastic';
import { SearchBody } from '../types/SearchBody';

@Service()
export default class SearchService {
  constructor(@Inject('elastic') private elastic) {
  }

  public async search(keyword: string): Promise<any> {
    const searchParams: SearchBody = {
      query: {
        match: { 'data.note': keyword }
      }
    };
    return this.elastic.getSearch(searchParams);
  }
}
