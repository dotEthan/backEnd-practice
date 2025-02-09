const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  console.log('getting');
  Product.fetchAll()
    .then((products) => {
      console.log('getProdcuts: ', products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Product Page',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log('getIndex shop controller err: ', err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    res.render('shop/product-details', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  });
  // .catch((err) => console.log('getProduct shop controller err: ', err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log('getIndex shop controller err: ', err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => console.log('getCart err: ', err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
