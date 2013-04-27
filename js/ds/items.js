goog.provide('k3d.ds.Items');

goog.require('pstj.ds.List');

/**
 * My new class description
 * @constructor
 * @extends {pstj.ds.List}
 */
k3d.ds.Items = function(items) {
  goog.base(this, items)
};
goog.inherits(k3d.ds.Items, pstj.ds.List);

goog.scope(function() {

  var _ = k3d.ds.Items.prototype;

});

