goog.provide('k3d.component.Select');
goog.provide('k3d.component.SelectTemplate');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('goog.ui.Component.EventType');
goog.require('k3d.component.FiltersTemplate');
goog.require('k3d.ds.filter');
goog.require('k3d.template');
goog.require('pstj.ui.Template');
goog.require('pstj.widget.Select');
goog.require('pstj.widget.ToggleGroup');



/**
 * The template for the item selection dialog.
 * @constructor
 * @extends {pstj.ui.Template}
 */
k3d.component.SelectTemplate = function() {
  goog.base(this);
};
goog.inherits(k3d.component.SelectTemplate, pstj.ui.Template);
goog.addSingletonGetter(k3d.component.SelectTemplate);


/** @inheritDoc */
k3d.component.SelectTemplate.prototype.getTemplate = function(model) {
  return k3d.template.itemselectbox({}).getContent();
};



/**
 * Suctom select box that understands our filters.
 * @constructor
 * @extends {pstj.widget.Select}
 * @param {pstj.ui.Template=} opt_template The template to use for select box.
 * @param {pstj.ui.Template=} opt_item_template The template to use for
 *   selection item.
 */
k3d.component.Select = function(opt_template, opt_item_template) {
  goog.base(this, opt_template ||
      k3d.component.SelectTemplate.getInstance(), opt_item_template);
  /**
   * @private
   * @type {boolean}
   */
  this.hasCornerTop_ = false;
  /**
   * @private
   * @type {boolean}
   */
  this.hasCornerBottom_ = false;
  /**
   * @private
   * @type {number}
   */
  this.topSpace_ = 0;
  /**
   * @private
   * @type {number}
   */
  this.bottomSpace_ = 0;
  /**
   * @private
   * @type {pstj.widget.ToggleGroup}
   */
  this.filterGroup_ = new pstj.widget.ToggleGroup(
      k3d.component.FiltersTemplate.getInstance());
  this.updateFiltersInternal_ = new goog.async.Delay(function() {
    this.setFilter(k3d.ds.filter.createNamedFilter(this.getCheckedFilter(),
        this.topSpace_, this.bottomSpace_, this.hasCornerTop_,
        this.hasCornerBottom_));
  }, 10, this);
};
goog.inherits(k3d.component.Select, pstj.widget.Select);


goog.scope(function() {
var _ = k3d.component.Select.prototype;


/**
 * Sets the visibility of the filter buttons.
 * @param {boolean} visible True to make the filter buttons visible.
 * @param {number=} opt_top If we want to show the filter buttons we would
 *   provide the available widths.
 * @param {number=} opt_bottom Available width at the bottom row.
 * @param {boolean=} opt_top_has_corner True if the top row has already an
 *   active corner.
 * @param {boolean=} opt_bottom_has_corner True if the bottom row already has
 *   corner item.
 */
_.setFiltersVisible = function(visible, opt_top, opt_bottom, opt_top_has_corner,
    opt_bottom_has_corner) {
  if (visible) {
    goog.dom.classlist.add(this.getElement(), goog.getCssName(
        'filters-visible'));

    this.setAvailableSpaces(goog.asserts.assertNumber(opt_top),
        goog.asserts.assertNumber(opt_bottom), !!opt_top_has_corner,
        !!opt_bottom_has_corner);

    this.setFilter(k3d.ds.filter.createNamedFilter(this.getCheckedFilter(),
        this.topSpace_, this.bottomSpace_, this.hasCornerTop_,
        this.hasCornerBottom_));

  } else {
    goog.dom.classlist.remove(this.getElement(), goog.getCssName(
        'filters-visible'));
  }
};


/**
 * Sets the spaces available on both top and bottom row.
 * @param {number} top The width available in the top row
 * @param {number} bottom The width available in the bottom row.
 * @param {boolean} corner_top True if the top row has a corner item and
 *   should not allow another one.
 * @param {boolean} corner_bottom True if the bottom row shoul not allow
 *   another coner item.
 */
_.setAvailableSpaces = function(top, bottom, corner_top, corner_bottom) {
  this.topSpace_ = top;
  this.bottomSpace_ = bottom;
  this.hasCornerTop_ = corner_top;
  this.hasCornerBottom_ = corner_bottom;
};


/** @inheritDoc */
_.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.filterGroup_,
      goog.ui.Component.EventType.SELECT, function(e) {
        e.stopPropagation();
        this.updateFiltersInternal_.start();
      });
};


/** @inheritDoc */
_.decorateInternal = function(el) {
  goog.base(this, 'decorateInternal', el);
  this.addChild(this.filterGroup_);
  this.filterGroup_.decorate(this.getEls(goog.getCssName('filters-group')));
};


/** @inheritDoc */
_.setModel = function(model) {
  model.setDelayFilterAppliedEvent(false);
  goog.base(this, 'setModel', model);
};


/**
 * Getter for the prefered filter action.
 * @return {string}
 */
_.getCheckedFilter = function() {
  return this.filterGroup_.getCheckedAction();
};
});  // goog.scope
