(async () => {

  var header = document.getElementById('header');
  var footer = document.getElementById('footer');
  var headerContent = await fetch('../../layouts/header.html');
  var footerContent = await fetch('../../layouts/footer.html');

  header.innerHTML = await headerContent.text();
  footer.innerHTML = await footerContent.text();

})();

var currentURL = new URLSearchParams(window.location.search);

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

var liteCardProduct = (product) => {
  return '<div class="row py-2">' +
    '<div class="col-3">' +
    '<img src="' + product.picture + '" alt="">' +
    '</div>' +
    '<div class="col-9">' +
    '<h6>' + product.name + '</h6>' +
    '<p>' + money(product.price) + '</p>' +
    '</div>' +
    '</div>'
}

var categoryFilterRadio = (product) => {
  var priceParam = currentURL.get('price') ?? "None";
  var productCategoryParam = currentURL.get('category') ?? "None";
  var checkedRadio = '<i class="fas fa-check-circle" style="color:#0E6EFD"></i>';
  var uncheckedRadio = '<i class="far fa-circle" style="color:#BFBFBF"></i>';
  return '<div>' +
    '<a href="./collections.html?category=' + product + '&price=' + priceParam + '">' +
    ((productCategoryParam == null && product == "None") ? checkedRadio :
      productCategoryParam == product ? checkedRadio :
        uncheckedRadio) +
    '<label class="form-check-label px-2" for="' + 'flexRadioDefault' + product + '" >' +
    product +
    '</label>' +
    '</a>' +
    '</div>';
};

var priceRangeFilterRadio = (price, index) => {
  var priceParam = currentURL.get('price') ?? "None";
  var productCategoryParam = currentURL.get('category') ?? "None";
  var checkedRadio = '<i class="fas fa-check-circle" style="color:#0E6EFD"></i>';
  var uncheckedRadio = '<i class="far fa-circle" style="color:#BFBFBF"></i>';
  return '<div>' +
    '<a href="./collections.html?price=' + (index==0?"None":index) + '&category=' + productCategoryParam + '">' +
    (((priceParam == "None" && index == 0)) ? checkedRadio :
      priceParam == index ? checkedRadio :
        uncheckedRadio) +
    '<label class="form-check-label px-2" for="' + 'flexRadioDefault' + index + '" >' +
    price +
    '</label>' +
    '</a>' +
    '</div>';
}


var getCategories = (callback) => {
  DB('products', (products) => {
    var categories = [];
    products.forEach(v => {
      categories.push(v['category'])
    })
    callback(["None", ...new Set(categories)])
  });
}

var getProductsByPrices = (priceRange, callback) => {
  if (priceRange != 'None') {
    DB('products', (products) => {
      switch (priceRange) {
        case "1":
          callback(products.filter(value => value.price >= 0 && value.price <= 800000))
          break;
        case "2":
          callback(products.filter(value => value.price >= 800000 && value.price <= 1500000))
          break;
        case "3":
          callback(products.filter(value => value.price >= 1500000 && value.price <= 5000000))
          break;
        case "4":
          callback(products.filter(value => value.price >= 5000000))
          break;
        default:
          callback(products);
          break;
      }
    });
  }
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