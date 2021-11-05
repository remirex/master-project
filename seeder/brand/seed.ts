import faker from 'faker';

import mongooseLoader from '../../src/loaders/mongoose';

async function brandDbSeed() {
  try {
    const client = await mongooseLoader();
    const collection = client.collection('brands');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await collection.drop();

    // make a bunch of time series data
    let brandData : string[] = [];

    for (let i = 0; i < 100; i++) {
      let newBrand: any = {
        name: faker.lorem.word(6),
        slug: faker.lorem.slug(2),
        logo: faker.image.imageUrl(),
        createdAt: faker.date.recent(),
      };
      brandData.push(newBrand);
    }
    await collection.insertMany(brandData);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

export const brandSeed = brandDbSeed();
