(async () => {

  var header = document.getElementById('header');
  var footer = document.getElementById('footer');
  var headerContent = await fetch('../../layouts/header.html');
  var footerContent = await fetch('../../layouts/footer.html');

  header.innerHTML = await headerContent.text();
  footer.innerHTML = await footerContent.text();

})();

var DB = (table = undefined, callback) => {
  if (table !== undefined && table !== null) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../../databases/' + table + '.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);
  }
};

var money = (n = 0) => {
  return 'Rp ' + n.toLocaleString('id');
};

var cardProduct = (product) => {
  return '<div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-3">' +
    '<div class="card">' +
    '<a href="./detail.html?product_id=' + product.id + '"><img src="' + product.picture + '" class="card-img-top"></a>' +
    '<div class="card-body">' +
    '<a href="./detail.html?product_id=' + product.id + '"><h5 class="card-title">' + product.name + '</h5></a>' +
    '<p class="card-text small">' + money(product.price) + '</p>' +
    '</div>' +
    '</div>' +
    '</div>';
};

var categoryProduct = (product,checked=false,onclick) => {
  var productId = new URLSearchParams(window.location.search).get('category');
  return '<div class="form-check ">' +
    
    '<a href="./collections.html?category=' + product + '">' +
    (productId==product?'~~' :'')+
    '<label class="form-check-label" for="' + 'flexRadioDefault' + product + '" >' +
    product +
    '</label>' +
    '</a>'+
    '</div>';
};

var getCategories = (callback) => {
  DB('products', (products) => {
    var categories = [];
    products.forEach(v => {
      categories.push(v['category'])
    })
    callback([...new Set(categories)])
  });
}

var getPrices = (callback) => {
  DB('products', (products) => {
    var categories = [];
    products.forEach(v => {
      categories.push(v['category'])
    })
    callback([...new Set(categories)])
  });
}

var getProducts = (orderBy = 'id', orderByDirection = 'asc', limit = 0, callback) => {
  DB('products', (products) => {
    if (orderBy !== undefined && orderBy !== null) products.sort(product => product[orderBy]);
    if (limit !== undefined && limit !== null && limit > 0) products.length = limit;
    if (orderByDirection !== undefined && orderByDirection !== null) {
      if (orderByDirection == 'desc') products.reverse();
    }
    callback(products);
  });
};

var findProduct = (productId = undefined, callback) => {
  getProducts(
    orderBy = 'id',
    orderByDirection = 'asc',
    limit = 0,
    (products) => {
      var product = products.find(product => product.id == productId);
      if (product === undefined) {
        window.location = '../../404.html';
      }
      callback(product);
    });
};