goog.provide('k3d.control.Price');

goog.require('goog.asserts');
goog.require('k3d.component.PriceLabelTemplate');
goog.require('k3d.ds.definitions');
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
   */
  _.loadData = function(kitchen) {
    this.data = kitchen;
    this.update();
  };

  /**
   * Calculates the price of the whole kitchen based on its current structure.
   * @private
   * @return {number}
   */
  _.calculatePrice_ = function() {
    // first and foremost collect all item's price.
    var price = 0;
    var wallindex = 0;
    var wall = null;
    var row = null;
    while (this.data.hasWallWithIndex(wallindex)) {
      wall = this.data.getWall(wallindex);
      row = wall.getRow(true);
      row.forEach(function(item) {
        price = price + goog.asserts.assertNumber(item.getProp(Struct.PRICE));
      });
      row = wall.getRow(false);
      row.forEach(function(item) {
        price = price + goog.asserts.assertNumber(item.getProp(Struct.PRICE));
      });
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

