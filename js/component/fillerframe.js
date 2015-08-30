/**
 * @fileoverview Modified filler that can account for header on top of it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('k3d.ui.Filler');

goog.require('k3d.ds.definitions');
goog.require('pstj.ui.SheetFrame');



/**
 * Provides filler that handles the header more gracefully.
 * @constructor
 * @extends {pstj.ui.SheetFrame}
 */
k3d.ui.Filler = function() {
  goog.base(this);
};
goog.inherits(k3d.ui.Filler, pstj.ui.SheetFrame);


/** @inheritDoc */
k3d.ui.Filler.prototype.getUpdatedSize = function() {
  var size = goog.base(this, 'getUpdatedSize');
  size.height = size.height - k3d.ds.definitions.headerHeight;
  return size;
};
