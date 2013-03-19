goog.provide('k3d.ui.Filler');

goog.require('k3d.ds.definitions');
goog.require('pstj.ui.Filler');

/**
 * @fileoverview MOdified filler that can account for header on top of it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides filler that handles the header more gracefully.
 * @constructor
 * @extends {pstj.ui.Filler}
 */
k3d.ui.Filler = function() {
  goog.base(this);
};
goog.inherits(k3d.ui.Filler, pstj.ui.Filler);

/** @inheritDoc */
k3d.ui.Filler.prototype.calculateUpdatedSize = function() {
  var size = goog.base(this, 'calculateUpdatedSize');
  size.height = size.height - k3d.ds.definitions.headerHeight;
  return size;
};
