import faker from 'faker';
import mongoose from 'mongoose';

import mongooseLoader from '../../src/loaders/mongoose';

async function populateProducts() {
  try {
    const client = await mongooseLoader();
    const collection = client.collection('products');

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    await collection.drop();

    // make a bunch of time series data
    let productData : string[] = [];

    for (let i = 0; i < 100; i++) {
      let newProduct: any = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        richDescription: faker.commerce.productDescription(),
        image: faker.image.imageUrl(),
        images: '',
        brand: mongoose.Types.ObjectId("5063114bd386d8fadbd6b004"),
        category: mongoose.Types.ObjectId("615c177caba18000956fa52d"),
        price: faker.commerce.price(),
        countInStock: faker.datatype.number(255),
        rating: faker.datatype.number(1000),
        numReviews: faker.datatype.number(500),
        isFeatured: false,
        createdAt: faker.date.recent(),
      };
      productData.push(newProduct);
    }
    await collection.insertMany(productData);
    process.exit();
  } catch (err) {

  }
}

export const productSeed = populateProducts();
