import faker from 'faker';
import mongoose from 'mongoose';

import mongooseLoader from '../../src/loaders/mongoose';

async function attributeDbSeed() {
  try {
    const client = await mongooseLoader();
    const collection = client.collection('attributes');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await collection.drop();

    // make a bunch of time series data
    let attributeData : string[] = [];

    for (let i = 0; i < 20; i++) {
      let newAttribute: any = {
        name: faker.lorem.word(6),
        code: faker.lorem.slug(1),
        frontend_type: faker.lorem.word(1),
        is_filterable: 0,
        is_required: 0,
        createdAt: faker.date.recent(),
      };
      attributeData.push(newAttribute);
    }
    await collection.insertMany(attributeData);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

export const attributeSeed = attributeDbSeed();
