import faker from 'faker';

import mongooseLoader from '../../src/loaders/mongoose';
import mongoose from 'mongoose';

async function attributeDbSeed() {
  try {
    const client = await mongooseLoader();
    const collection = client.collection('attributes');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await collection.drop();

    // make a bunch of time series data
    let attributeData : string[] = [];

    let testAttribute: any = {
      _id: mongoose.Types.ObjectId("618b9a0599386f621c7baa49"),
      name: faker.lorem.word(6),
      code: faker.lorem.slug(1),
      frontend_type: faker.lorem.word(1),
      is_filterable: 0,
      is_required: 0,
      createdAt: faker.date.recent(),
    }

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
    attributeData.push(testAttribute);
    await collection.insertMany(attributeData);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

export const attributeSeed = attributeDbSeed();
