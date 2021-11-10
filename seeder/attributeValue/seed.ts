import faker from 'faker';
import mongoose from 'mongoose';

import mongooseLoader from '../../src/loaders/mongoose';
import attributeValue from '../../src/models/attributeValue';

async function attributeValueDbSeed() {
  try {
    const client = await mongooseLoader();
    const collection = client.collection('attributevalues');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await collection.drop();

    // make a bunch of time series data
    let attributeValueData : string[] = [];

    for (let i = 0; i < 100; i++) {
      let newAttributeValue: any = {
        value: faker.lorem.word(6),
        price: faker.commerce.price(),
        attribute: mongoose.Types.ObjectId("618b9a0599386f621c7baa49"),
        createdAt: faker.date.recent(),
      };
      attributeValueData.push(newAttributeValue);
    }
    await collection.insertMany(attributeValueData);
    process.exit();
  } catch (err) {

  }
}

export const attributeValueSeed = attributeValueDbSeed();
