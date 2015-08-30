goog.provide('k3d.ds.ItemList');

goog.require('k3d.ds.Item');
goog.require('pstj.ds.List');



/**
 * My new class description
 * @constructor
 * @extends {pstj.ds.List}
 * @param {Array<Object>=} opt_nodes The items that are available in the
 *   list.
 */
k3d.ds.ItemList = function(opt_nodes) {
  goog.base(this);
  if (goog.isArray(opt_nodes)) {
    // in this case we know that we need to convert those item, ckip checks on
    // the parent and convert everything internally.
    for (var i = 0, len = opt_nodes.length; i < len; i++) {
      this.add(new k3d.ds.Item(opt_nodes[i]));
    }
  }
};
goog.inherits(k3d.ds.ItemList, pstj.ds.List);
