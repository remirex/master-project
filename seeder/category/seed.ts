import faker from 'faker';

import mongooseLoader from '../../src/loaders/mongoose';

async function categoryDbSeed() {
  try {
    const client = await mongooseLoader();
    const collection = client.collection('categories');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await collection.drop();

    // make a bunch of time series data
    let categoryData : string[] = [];

    for (let i = 0; i < 100; i++) {
      let newCategory: any = {
        name: faker.lorem.word(6),
        slug: faker.lorem.slug(2),
        image: faker.image.imageUrl(),
        featured: false,
        menu: true,
        description: faker.lorem.text(20),
        createdAt: faker.date.recent(),
      };
      categoryData.push(newCategory);
    }
    await collection.insertMany(categoryData);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

export const categorySeed = categoryDbSeed();
