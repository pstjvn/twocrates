goog.provide('k3d.control.Price');

goog.require('k3d.component.PriceLabelTemplate');
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
   * @private
   * @type {k3d.ds.KitchenProject}
   */
  this.data_ = null;
  this.label_ = new pstj.ng.Template(
    k3d.component.PriceLabelTemplate.getInstance());
  this.label_.render(document.body);
};
goog.inherits(k3d.control.Price, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Price);

goog.scope(function() {

  var _ = k3d.control.Price.prototype;
  /**
   * Loads the data of the kitchen.
   * @param {k3d.ds.KitchenProject} kitchen The kitchen project data record.
   */
  _.loadData = function(kitchen) {
    this.data_ = kitchen;
    this.update();
  };

  /**
   * Recalculaes the price.
   */
  _.update = function() {
    this.label_.setModel({
      'id': 1,
      'price': 124399
    });
    // recalculate the price and vizualize! for ech wall iterate bottom row and
    // calculate bench size and kickboard size. sum(bench), sum(kickboard),
    // sum(handles) iterate top row sum(handles) for items that are first - skip
    // as those are calculated in prev wall for items that are not first (should
    // be last) and corner calulcate as usual. becn top for corner calculation
    // is tricky. finally calculate finish?!?
  };
});

