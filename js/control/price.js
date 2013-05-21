goog.provide('k3d.control.Price');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('k3d.component.PriceLabelTemplate');
goog.require('k3d.ds.CabinetRow');
goog.require('k3d.ds.definitions');
goog.require('k3d.ds.helpers');
goog.require('pstj.control.Base');
goog.require('pstj.ng.Template');

/**
 * My new class description
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Price = function() {
  goog.base(this);
  /**
   * @protected
   * @type {k3d.ds.KitchenProject}
   */
  this.data = null;
  this.delay_ = new goog.async.Delay(function() {
    this.setPrice(this.calculatePrice_());
  }, 50, this);
  this.label_ = new pstj.ng.Template(
    k3d.component.PriceLabelTemplate.getInstance());
  this.label_.render(document.body);
};
goog.inherits(k3d.control.Price, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Price);

goog.scope(function() {

  var _ = k3d.control.Price.prototype;
  var Struct = k3d.ds.definitions.Struct;

  /**
   * Loads the data of the kitchen.
   * @param {k3d.ds.KitchenProject} kitchen The kitchen project data record.
   * @param {pstj.ds.List} finishes The finishes data list.
   * @param {pstj.ds.List} handles The hadles data list.
   */
  _.loadData = function(kitchen, finishes, handles) {
    console.log(arguments);
    this.data = kitchen;
    this.handles = handles;
    this.finishes = finishes;
    this.update();
  };

  /**
   * Calculates the price of the whole kitchen based on its current structure.
   * TODO: offset kickboard
   * TODO: offset benchtop?
   * TODO: get prices from stogae.
   * @private
   * @return {number}
   */
  _.calculatePrice_ = function() {
    // first and foremost collect all item's price.
    var price = 0;
    var wallindex = 0;
    var wall = null;
    var row = null;
    var kickboard_price = goog.global['KICKBOARD_PRICE'];
    var benchtop_price = goog.global['BENCHTOP_PRICE'];
    // combine the price for all items
    // until there is a wall
    while (this.data.hasWallWithIndex(wallindex)) {
      wall = this.data.getWall(wallindex);
      //gather the top and bottom rows
      goog.array.forEach([wall.getRow(true), wall.getRow(false)],
        function(row, index) {
          goog.asserts.assertInstanceof(row, k3d.ds.CabinetRow,
            'Expected cabinet row here');
          // for each item in a row.
          row.forEach(function(item) {
            if (k3d.ds.helpers.isClone(item)) return;
            price += goog.asserts.assertNumber(item.getProp(Struct.PRICE));
            //console.log('After price', price);
            price += (item.getProp(Struct.HANDLES) * this.handles.getById(
              this.data.getProp(Struct.HANDLE)).getProp(Struct.PRICE));

          }, this);
          //console.log('aftert handles', price);
          // if it is the botom row calculate the benchtop
          if (index > 0) {
            price += (row.getWidth() / 1000) * benchtop_price;
            if (row.getWidth() > 0) {
              price += ((row.getWidth() + ((this.data.hasWallWithIndex(
                wallindex + 1)) ? 50 : 0)) / 1000) * kickboard_price;
            }
          }

          price += (row.getWidth() / 1000) * this.finishes.getById(
            this.data.getProp(Struct.FINISH)).getProp(Struct.PRICE);
          // console.log('After finishes', price, this.finishes.getById(
          //   this.data.getProp(Struct.FINISH)).getProp(Struct.PRICE));
        }, this);
        // console.log('total per wall', price);
      wallindex++;
    }
    return price;
  };

  /**
   * Sets the price on the price label.
   * @param {number} price The new price to display.
   */
  _.setPrice = function(price) {
    this.label_.setModel({
      'id': 1,
      'price': price
    });
  };

  /**
   * Trigger price recalculation.
   */
  _.update = function() {
    this.delay_.start();
    // recalculate the price and vizualize! for ech wall iterate bottom row and
    // calculate bench size and kickboard size. sum(bench), sum(kickboard),
    // sum(handles) iterate top row sum(handles) for items that are first - skip
    // as those are calculated in prev wall for items that are not first (should
    // be last) and corner calulcate as usual. becn top for corner calculation
    // is tricky. finally calculate finish?!?
  };
});

