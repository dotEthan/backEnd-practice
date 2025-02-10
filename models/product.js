const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// /**
//  * Represents a product in the e-commerce system.
//  * Handles creation and persistence of product data in MongoDB.
//  */

// class Product {
//   /**
//    * Creates a new Product instance.
//    * @param {string} title - The product's title/name
//    * @param {number} price - The product's price
//    * @param {string} description - The product's description
//    * @param {string} imageUrl - URL to the product's image
//    */
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   /**
//    * Saves the product to MongoDB.
//    * @returns {Promise<Object>} Result of inserting operation
//    * @throws {Error} If database save fails
//    */
//   save() {
//     const db = getDb();
//     let dbOp;
//     console.log(this._id);
//     if (this._id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   /**
//    * gets all products from MongoDB.
//    * @returns {Promise<Product[]>} Returns all Products
//    * @throws {Error} If database call fails
//    */
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log('products: ', products);
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next() // gets the next (only in this case) document
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(id) })
//       .then((result) => console.log('deleted: ', result))
//       .catch((err) => console.log(err));
//   }
// }
// module.exports = Product;
