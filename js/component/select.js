goog.provide('k3d.component.Select');

goog.require('pstj.widget.Select');

/**
 * Suctom select box that understands our filters.
 * @constructor
 * @extends {pstj.widget.Select}
 * @param {pstj.ui.Template=} opt_template The template to use for select box.
 * @param {pstj.ui.Template=} opt_item_template The template to use for
 *   selection item.
 */
k3d.component.Select = function(opt_template, opt_item_template) {
  goog.base(this, opt_template, opt_item_template);
};
goog.inherits(k3d.component.Select, pstj.widget.Select);

goog.scope(function() {

  var _ = k3d.component.Select.prototype;

  /**
   * Sets the visibility of the filter buttons.
   * @param {boolean} visible True to make the filter buttons visible.
   */
  _.setFiltersVisible = function(visible) {};

  /** @inheritDoc */
  _.setModel = function(model) {
    model.setDelayFilterAppliedEvent(false);
    goog.base(this, 'setModel', model);
  };

});

