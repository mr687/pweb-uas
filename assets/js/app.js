var cookie = {
  set: function (name, value) {
    $.cookie(name, value)
  },
  get: function (name) {
    return $.cookie(name)
  }
};

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

var cartProduct = (product, cart) => {
  return '<div class="row table-item border-bottom py-3">' +
    '<div class="col-3 col-sm-2">' +
    '<img src="' + product.picture + '" alt="">' +
    '</div>' +
    '<div class="col-9 col-sm-8">' +
    '<h5><a href="../../detail.html?product_id=' + product.id + '">' + product.name + '</a></h5>' +
    '<p><a href="../../collections.html?category=' + product.category + '&price=None">' + product.category + '</a></p>' +
    '<p class="text-primary">' + money(product.price) + '</p>' +
    '<div class="d-flex">' +
    '<div class="input-group mb-3 qty-button" style="width: 130px;">' +
    '<button class="btn btn-outline-secondary"  onclick="minProduct(' + product.id + ')" type="button">-</button>' +
    '<input type="text" id="product-' + product.id + '" class="form-control text-center" placeholder="" style="font-size: 1.3rem;" value="' + cart.qty + '">' +
    '<button class="btn btn-outline-secondary" onclick="plusProduct(' + product.id + ')" type="button">+</button>' +
    '</div>' +
    '<a href="javascript:void(0);" class="text-danger text-decoration-underline mt-2 ms-3" onclick="removeProduct(' + product.id + ')">Remove</a>' +
    '</div>' +
    '</div>' +
    '<div class="col-12 col-sm-2 d-none d-sm-inline-block text-end">' +
    '<span class="h5"><strong>' + money(product.price * cart.qty) + '</strong></span>' +
    '</div>' +
    '</div>';
};

var cardProduct = (product) => {
  return '<div class="col-6 col-sm-6 col-md-4 col-lg-3 mb-3 product">' +
    '<div class="card">' +
    '<a href="./detail.html?product_id=' + product.id + '" class="product-img"><img src="' + product.picture + '" class="card-img-top"></a>' +
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
    '</div>';
};

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
    '<a href="./collections.html?price=' + (index == 0 ? "None" : index) + '&category=' + productCategoryParam + '">' +
    (((priceParam == "None" && index == 0)) ? checkedRadio :
      priceParam == index ? checkedRadio :
      uncheckedRadio) +
    '<label class="form-check-label px-2" for="' + 'flexRadioDefault' + index + '" >' +
    price +
    '</label>' +
    '</a>' +
    '</div>';
};


var getCategories = (callback) => {
  DB('products', (products) => {
    var categories = [];
    products.forEach(v => {
      categories.push(v['category'])
    });
    callback(["None", ...new Set(categories)])
  });
};

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
};

var getPrices = (callback) => {
  DB('products', (products) => {
    var categories = [];
    products.forEach(v => {
      categories.push(v['category'])
    });
    callback([...new Set(categories)])
  });
};

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

$(document).ready(function () {
  var pageload = $('#pageload');
  if (!pageload.hasClass('d-none')) {
    pageload.addClass('d-none');
  }
});

(async () => {
  var header = document.getElementById('header');
  var footer = document.getElementById('footer');
  var headerContent = await fetch('../../layouts/header.html');
  var footerContent = await fetch('../../layouts/footer.html');
  header.innerHTML = await headerContent.text();
  footer.innerHTML = await footerContent.text();

  $(document).ready(function () {
    var pageload = $('#pageload');
    if (!pageload.hasClass('d-none')) {
      pageload.addClass('d-none');
    }
  });

  var itemsInCart = JSON.parse(cookie.get('dreamroom.cart.items'));
  document.getElementById('cartItemsCount').innerHTML = itemsInCart.length == 0 ? '' : itemsInCart.length;
})();