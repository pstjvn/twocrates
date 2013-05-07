goog.provide('k3d.component.Item');
goog.provide('k3d.component.PubSub');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('goog.pubsub.PubSub');
goog.require('goog.style');
goog.require('k3d.ds.definitions');
goog.require('pstj.ds.ListItem');
goog.require('pstj.lab.style.css');
goog.require('pstj.ui.MoveTouch');

/**
 * The pubsub channel for the move of an item.
 * @type {goog.pubsub.PubSub}
 */
k3d.component.PubSub = new goog.pubsub.PubSub();

/**
 * The topic we are publishing on.
 * @type {string}
 */

k3d.component.PubSubTopic = 'MOVE';

/**
 * The item that we work with on the drawing board.
 * @constructor
 * @extends {pstj.ui.MoveTouch}
 * @param {pstj.ui.Template=} opt_template The optional template to use when
 *   constructing dom from scratch.
 */
k3d.component.Item = function(opt_template) {
  goog.base(this, opt_template);
  /**
   * Provides cachable values for item's visual setup: [width, height, top,
   *   left].
   * @private
   * @type {Array.<number>}
   */
  this.styleoptions_ = [0.0, 0.0, 0.0, 0.0];
  /**
   * Cache the values of movement: [initialx, initialy, newx, newy].
   * @private
   * @type {Array.<number>}
   */
  this.moveCache_ = [0.0, 0.0, 0.0, 0.0];
};
goog.inherits(k3d.component.Item, pstj.ui.MoveTouch);

/**
 * The events of the items on the drawing board.
 * @enum {string}
 */
k3d.component.Item.EventType = {
  MODEL_CHANGE: goog.events.getUniqueId('model-change')
};

goog.scope(function() {

  var _ = k3d.component.Item.prototype;
  var css = pstj.lab.style.css;

  /**
   * We need to apply the scale each time we change the tranformation.
   * @type {string}
   * @const
   */
  _.activatedScaleProperty = 'scale(1.1)';

  /**
   * @override
   * @return {pstj.ds.ListItem} The data record for the item.
   */
  _.getModel;

  /** @inheritDoc */
  _.setModel = function(model) {
    goog.asserts.assertInstanceof(model, pstj.ds.ListItem,
      'The data record should be a ListItem');
    goog.base(this, 'setModel', model);
    if (this.isInDocument()) {
      this.dispatchEvent(k3d.component.Item.EventType.MODEL_CHANGE);
    }
  };

  /** @inheritDoc */
  _.enterDocument = function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, pstj.ui.Touchable.EventType.MOVE,
      this.handleMove);
    this.getHandler().listen(this, pstj.ui.Touchable.EventType.PRESS,
      this.handlePress);
    this.applySizeOnDOM_();
  };

  /**
   * Handles the activate event.
   * @param {goog.events.Event} e The ACTIVATE component event.
   * @protected
   */
  _.handleActivate = function(e) {
    // here we do need to calculate the item position...
    goog.dom.classlist.add(this.getElement(),
      goog.getCssName('sheet-item-active'));
  };

  /**
   * Handles the press event.
   * @param {pstj.ui.Touchable.Event} e The PRESS event from touchables.
   * @protected
   */
  _.handlePress = function(e) {
    this.moveCache_[0] = e.x;
    this.moveCache_[1] = e.y;
  };

  /**
   * Do not stop the event as we use it in the sheet to switch move modes.
   * @override
   * @param {pstj.ui.Touchable.Event} e The long press touch event.
   * @protected
   */
  _.handleLongPress = function(e) {
    //goog.base(this, 'handleLongPress', e);
    this.setMoveEnabled(true);
    goog.dom.classlist.add(this.getElement(),
      goog.getCssName('sheet-item-moving'));
  };

  /**
   * Handles the move event.
   * @param {pstj.ui.Touchable.Event} e The move event abstraction.
   * @protected
   */
  _.handleMove = function(e) {
    if (this.isMoveEnabled()) {
      e.stopPropagation();
      this.moveCache_[2] = e.x;
      this.moveCache_[3] = e.y;
      this.update();
    }
  };

  /** @inheritDoc */
  _.handleRelease = function(e) {
    goog.base(this, 'handleRelease', e);
    goog.dom.classlist.remove(this.getElement(),
      goog.getCssName('sheet-item-moving'));
    css.setTranslation(this.getElement(), 0, 0);
  };

  /** @inheritDoc */
  _.draw = function(ms) {
    css.setTranslation(this.getElement(),
      -(this.moveCache_[0] - this.moveCache_[2]),
      -(this.moveCache_[1] - this.moveCache_[3]), undefined,
      this.activatedScaleProperty);
    k3d.component.PubSub.publish(k3d.component.PubSubTopic);
    return false;
  };

  /**
   * Provides access method to the currently applied difference in position.
   * @return {number}
   */
  _.getXOffset = function() {
    return -(this.moveCache_[0] - this.moveCache_[2]);
  };

  /**
   * Applies the internally stored size to the DOM node attached to the
   *   component.
   * @private
   */
  _.applySizeOnDOM_ = function() {
    this.getElement().style.position = 'absolute';
    this.getElement().style.width = this.styleoptions_[0] + '%';
    this.getElement().style.height = this.styleoptions_[1] + '%';
    this.getElement().style.top = this.styleoptions_[2] + '%';
    this.getElement().style.left = this.styleoptions_[3] + '%';
    this.getElement().style.backgroundImage = 'url(' + 'assets/1.png' + ')';
    // this.getElement().style.backgroundImage = 'url(' +
    //   goog.asserts.assertString(this.getModel().getProp(
    //     k3d.ds.definitions.Struct.DRAWING_IMAGE),
    //     'Image path shoudl be string') + ')';
  };

  /**
   * Applies the size values to the child of the drawing canvas.
   * @param {number} w The width of the child.
   * @param {number} h The height.
   * @param {number} l Left offset.
   * @param {number} t Top offset.
   */
  _.applyStyle = function(w, h, l, t) {
    this.styleoptions_[0] = w;
    this.styleoptions_[1] = h;
    this.styleoptions_[2] = t;
    this.styleoptions_[3] = l;
    this.styleIsDirty_ = true;
    if (this.isInDocument()) this.update();
  };

});
