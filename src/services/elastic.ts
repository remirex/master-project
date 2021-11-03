import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import { SearchBody } from '../types/SearchBody';
import { SearchResult } from '../types/SearchResult';

export default class Elastic {
  private static client = new Client({ node: 'http://localhost:9002' });

  public async dispatchToElasticSearch(event: string, data: any) {
    const doc1: RequestParams.Index = {
      index: 'yes_notes',
      body: {
        event,
        data,
      },
    };

    await Elastic.client.index(doc1);
  }

  public async getSearch(keyword: SearchBody): Promise<any> {
    const client = new Client({ node: 'http://localhost:9002' });
    const searchParams: RequestParams.Search<SearchBody> = {
      index: 'yes_notes',
      body: keyword,
    };

    const searchResult: ApiResponse<SearchResult<any>> = await client.search(searchParams);
    return searchResult.body;
  }
}
