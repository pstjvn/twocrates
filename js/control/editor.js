goog.provide('k3d.control.Editor');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.math.Size');
goog.require('goog.ui.Component.EventType');
goog.require('k3d.component.DrawingBoard');
goog.require('k3d.component.FinishItemTemplate');
goog.require('k3d.component.HandleItemTemplate');
goog.require('k3d.component.ItemView');
goog.require('k3d.component.PopOver');
goog.require('k3d.component.PubSub');
goog.require('k3d.component.SelectItemTemplate');
goog.require('k3d.control.Loader');
goog.require('k3d.ds.ItemPool');
goog.require('k3d.ds.definitions');
goog.require('k3d.ui.Filler');
goog.require('pstj.control.Base');
goog.require('pstj.ds.List');
goog.require('pstj.lab.style.css');
goog.require('pstj.math.utils');
goog.require('pstj.widget.Select');

/**
 * @fileoverview Provides the 'editor' functionality. It is closely bound to
 *   the datasheet component and depends on its implmentation for determining
 *   the moved objects in the sheet so do not use the generic touchsheet with
 *   this control, instead use the drawing board or a subclass of it.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

/**
 * Provides the design tool's editor controls.
 * @constructor
 * @extends {pstj.control.Base}
 */
k3d.control.Editor = function() {
  goog.base(this);
  /**
   * Callback function to execute on detected record change.
   * @type {?function(k3d.ds.KitchenProject): undefined}
   * @private
   */
  this.ondatachangecallback_ = null;
  /**
   * The real size of the wall (in millimeters) + an offset of 200 millimeters
   *   on both ends.
   * @type {number}
   * @protected
   */
  this.width = 0;
  /**
   * The real size of the wall (in millimeters) + an offset of 200 millimeters
   *   on both ends.
   * @type {number}
   * @protected
   */
  this.height = 0;

  /**
   * The frame in which to fit the drawing board. The frame itself reacts to
   *   user agent resizes and thus allow us to fit the sheet correclty even on
   *   orientation changes.
   * @type {k3d.ui.Filler}
   */
  this.frame = new k3d.ui.Filler();
  this.registerDisposable(this.frame);
  /**
   * The drawing sheet / board used to display the items.
   * @type {k3d.component.DrawingBoard}
   */
  this.drawsheet = new k3d.component.DrawingBoard();
  this.registerDisposable(this.drawsheet);
  this.getHandler().listen(this.drawsheet,
    k3d.component.DrawingBoard.EventType.REQUIRES_STOP_POINTS,
    this.provideStopPoints_).listen(this.drawsheet,
    k3d.component.DrawingBoard.EventType.RELEASE_OF_CHILD,
    this.onShiftCabinetEnd_);

  /**
   * The selection box for items.
   * @type {pstj.widget.Select}
   */
  this.selectBox = new pstj.widget.Select(undefined,
    k3d.component.SelectItemTemplate.getInstance());
  /**
   * The selection box for items.
   * @type {pstj.widget.Select}
   */
  this.selectFinish = new pstj.widget.Select(undefined,
    k3d.component.FinishItemTemplate.getInstance());
  /**
   * The selection box for items.
   * @type {pstj.widget.Select}
   */
  this.selectHandles = new pstj.widget.Select(undefined,
    k3d.component.HandleItemTemplate.getInstance());
  /**
   * Referrence to the kitchen project data structure.
   * @type {k3d.ds.KitchenProject}
   * @protected
   */
  this.data = null;
  /**
   * Referrence to the currently displayed wall.
   * @type {k3d.ds.Wall}
   * @protected
   */
  this.currentWall = null;
  /**
   * The ratio between the real wall size in millimeters to the pixels used to
   *   display it. This is used to calculate positions of elements using their
   *   millimeter values an match them to pixel value. \@private
   * @type {number}
   * @private
   */
  this.scaleFactor_ = 1;
  /**
   * List of components that have been added to the top row.
   * @type {Array.<k3d.component.Item>}
   * @private
   */
  this.topchildren_ = [];
  /**
   * List of components that have been added to the bottom row.
   * @type {Array.<k3d.component.Item>}
   * @private
   */
  this.bottomchildren_ = [];
  /**
   * The list of lists of stop points forthe movement.
   * @type {Array.<number>}
   * @protected
   */
  this.stopPoints = null;
  /**
   * The offset that should be applied to the item after all movement has
   *   ended.
   * @type {number}
   * @private
   */
  this.lastMovementOffset_ = 0;
  /**
   * Cache for the currently moved child. We can use this to speed up things
   *   and reuse it when calculating new positions after the move,
   * @type {k3d.component.Item}
   * @private
   */
  this.movedChild_ = null;
  /**
   * Cache the moved child's row, it can be reused in movement and after
   *   movement calculations.
   * @type {Array.<k3d.component.Item>}
   * @private
   */
  this.movedChildsRow_ = null;
  /**
   * The delayed reaction to a sheet resize. This is delayed to avoid unneeded
   *   calculation during refitting of the sheet in the frame.
   * @type {goog.async.Delay}
   * @private
   */
  this.handleSheetResizeDelayed_ = new goog.async.Delay(this.handleSheetResize,
    500, this);
  this.registerDisposable(this.handleSheetResizeDelayed_);
};
goog.inherits(k3d.control.Editor, pstj.control.Base);
goog.addSingletonGetter(k3d.control.Editor);

/**
 * Provides symbol names for the actions.
 * @enum {string}
 */
k3d.control.Editor.Actions = {
  CLOSE: 'close',
  CHANGE_MODEL: 'change-model',
  CHNAGE_SIZE: 'change-size'
};

// TODO: when loading a wall make sure to load all relevant images by items!
// This way we have a guarantee that when the user presses edit the images will
// be ready

goog.scope(function() {
  var _ = k3d.control.Editor.prototype;
  var Actions = k3d.control.Editor.Actions;
  var Struct = k3d.ds.definitions.Struct;

  /**
   * Offset in millimeters (1000 mm = 1 m) to put around the drawing.
   * @type {number}
   * @protected
   */
  _.widthVisualOffset = 300;

  /**
   * The default height at which to mount the upper row cabinets. Taken from
   *   (https://drive.google.com/#folders/0B4hL22c9ubPhOHdubTFCOWJsTFU).
   * @protected
   * @type {number}
   */
  _.heightOfUpperRow = 2070;

  /**
   * Sets the handler for the data change event.
   * @param {function(k3d.ds.KitchenProject): undefined} fn Fn.
   */
  _.setDataChangeHandler = function(fn) {
    this.ondatachangecallback_ = fn;
  };

  /**
   * Loads the kitcen project data record.
   * @param {k3d.ds.KitchenProject} kitchen The kitchen data structure.
   */
  _.loadData = function(kitchen) {
    this.data = kitchen;
    this.initialize();
  };

  /**
   * Put logic here that marks that everything possible to be preloaded (prior
   *   and after the initial showing) is done loading.
   */
  _.onLoadComplete = function() {
    k3d.control.Loader.getInstance().getItems().addCallback(goog.bind(
      function(items) {
        this.selectBox.setModel(items);
        this.selectBox.render();
      }, this));

    k3d.control.Loader.getInstance().getFinishes().addCallback(goog.bind(
      function(finishes) {
        this.selectFinish.setModel(finishes);
        this.selectFinish.render();
      }, this));

    k3d.control.Loader.getInstance().getHandles().addCallback(goog.bind(
      function(handles) {
        this.selectHandles.setModel(handles);
        this.selectHandles.render();
      }, this));
  };

  /** @inheritDoc */
  _.initialize = function() {
    goog.base(this, 'initialize');
    this.getHandler()

    .listen(this.drawsheet, goog.ui.Component.EventType.ACTIVATE,
      this.handleActionEvent)

    .listen(k3d.component.ItemView.getInstance(),
      goog.ui.Component.EventType.ACTION, this.handleItemViewAction)

    .listen(this.selectBox, [goog.ui.Component.EventType.SELECT,
      goog.ui.Component.EventType.CLOSE], this.handleItemSelectEvent)

    .listen(this.selectFinish, goog.ui.Component.EventType.SELECT,
      this.handleFinishSelection_)

    .listen(this.selectHandles, goog.ui.Component.EventType.SELECT,
      this.handleHandleSelection_)

    .listen(this.drawsheet, goog.events.EventType.RESIZE, function(e) {
      e.stopPropagation();
      this.handleSheetResizeDelayed_.start();
    });

    // Subscribe for position updated on children We need this in order to make
    // the movement of component possible.
    k3d.component.PubSub.subscribe(k3d.component.PubSubTopic, function() {
      // Finds the child that is moving currently (only one really).
      var movedchild = this.movedChild_;
      // Find where in X coordinate is the child now (offset in pixels).
      var currentoffset = movedchild.getXOffset();
      // Find the index of the moved child in the list of children currently
      // visualized.
      var index_of_child = goog.array.indexOf(this.movedChildsRow_, movedchild);
      // Record the child's natural width (mm).
      var childwidth = movedchild.getModel().getProp(Struct.WIDTH);
      // The distance the object was moved calculated in millimeters.
      var distancetraveled = currentoffset * this.scaleFactor_;
      var rowOfChildren = this.movedChildsRow_;
      // Null out out cache of positioning.
      this.lastMovementOffset_ = 0;

      // Handler for offsets, we need different handling for positive and
      // negative offsets.
      if (currentoffset < 0) {

        // Determine the start (edge) point agains which to calculate where the
        // moving element is tipping at right now. We are comparing those to the
        // stop points calculated when the movement started.
        var startpoint = this.stopPoints[index_of_child] - (
          childwidth / 2);

        // Iterate over the children that are left of the moved item (smaller
        // indexes) because the movement is determined to be to left.
        for (var i = index_of_child - 1; i >= 0; i--) {

          // If a stop point is passed
          if ((startpoint + distancetraveled) < this.stopPoints[i]) {
              this.lastMovementOffset_--;
              // Move the item to the right by the pixelized width of the moved
              // item.
              pstj.lab.style.css.setTranslation(rowOfChildren[i].getElement(),
                childwidth / this.scaleFactor_, 0);
          } else {

            // If the item is not passed return it ot its normal position.
            pstj.lab.style.css.setTranslation(rowOfChildren[i].getElement(), 0,
              0);
          }
        }
      } else if (currentoffset > 0) {
        var startpoint = this.stopPoints[index_of_child] + (
          childwidth / 2);
        for (var i = (index_of_child + 1); i < rowOfChildren.length; i++) {
          if ((startpoint + distancetraveled) > this.stopPoints[i]) {
            this.lastMovementOffset_++;
            pstj.lab.style.css.setTranslation(rowOfChildren[i].getElement(),
              -(childwidth / this.scaleFactor_), 0);
          } else {
            pstj.lab.style.css.setTranslation(rowOfChildren[i].getElement(), 0,
              0);
          }
        }
      }
    }, this);

    // find the first wall and load it.
    this.loadWall(0);

  };

  /**
   * Updates the stop points based on the current configuration of the items
   *   in the data record and cache the moved component.
   * @param {goog.events.Event} e The request for points event.
   * @private
   */
  _.provideStopPoints_ = function(e) {
    e.stopPropagation();
    this.movedChild_ = this.drawsheet.getMovedChild();
    if (goog.array.contains(this.topchildren_, this.movedChild_)) {
      this.movedChildsRow_ = this.topchildren_;
      this.stopPoints = this.currentWall.getStopPoints(true);
    } else if (goog.array.contains(this.bottomchildren_, this.movedChild_)) {
      this.movedChildsRow_ = this.bottomchildren_;
      this.stopPoints = this.currentWall.getStopPoints(false);
    } else {
      throw new Error('Cannot determine the row of the moved child');
    }
  };

  /**
   * Handles the event from drawsheet when a child of the sheet has been moved
   *   and then released.
   * @param {goog.events.Event} e The END OF MOVEMENT event.
   * @private
   */
  _.onShiftCabinetEnd_ = function(e) {
    e.stopPropagation();
    goog.array.forEach(this.movedChildsRow_, function(item) {
      pstj.lab.style.css.setTranslation(item.getElement(), 0, 0);
    });
    this.currentWall.getRow(
      (this.movedChildsRow_ == this.topchildren_) ? true : false).shiftItem(
      this.movedChild_.getModel(), this.lastMovementOffset_);
    if (goog.isNull(this.currentWall)) {
      throw new Error('We are mossing our call reference');
    }
    this.clearDrawing();
    this.visualizeItems();
    this.onDataChange();
    //this.loadWall(this.data.getWallIndex(this.currentWall));
  };

  /**
   * Handles for the SELECT event coming from a select widget hosting the
   *   available finishes for the kitchen.
   * @param {goog.events.Event} e The SELECT component event.
   * @private
   */
  _.handleFinishSelection_ = function(e) {
    this.data.setFinishId(this.selectFinish.getSelection().getId());
    k3d.component.PopOver.getInstance().setVisible(false);
    this.onDataChange();
  };

  /**
   * Handles the SELECT event from the handles select widget.
   * @param {goog.events.Event} e The SELECT event from Component.
   * @private
   */
  _.handleHandleSelection_ = function(e) {
    this.data.setHandleId(this.selectHandles.getSelection().getId());
    k3d.component.PopOver.getInstance().setVisible(false);
    this.onDataChange();
  };

  /**
   * Callback to execute when an item in the data record is changed.
   *   Confiturable.
   */
  _.onDataChange = function() {
    if (goog.isFunction(this.ondatachangecallback_)) {
      this.ondatachangecallback_(this.data);
    }
  };

  /**
   * Handles the event when the draw sheet has been resized (by scaling it).
   *   We need this event to intercept and calculate the new scale factor used
   *   in movement calculation of items.
   * @protected
   */
  _.handleSheetResize = function() {
    var size = this.drawsheet.size;
    // calculate the aspect ratio of the scale
    this.scaleFactor_ = this.currentWall.getProp(Struct.WIDTH) /
      this.drawsheet.size.width;
  };

  /**
   * Handles the select event coming from the items selection widget.
   * @param {goog.events.Event} e The SELECT component event.
   * @protected
   */
  _.handleItemSelectEvent = function(e) {
    if (e.type == goog.ui.Component.EventType.CLOSE) {
      // prevent the popover from closing.
      e.stopPropagation();
      k3d.component.PopOver.getInstance().addChild(
        k3d.component.ItemView.getInstance(), true);
    } else if (e.type == goog.ui.Component.EventType.SELECT) {
      // upate the model
      console.log('Selection made on a select component');
    }
  };

  /**
   * Handle actions from the itemview control.
   * @param {goog.events.Event} e The ACTION event from the view.
   * @protected
   */
  _.handleItemViewAction = function(e) {
    var target = /** @type {!pstj.ui.Button} */ (e.target);
    if (target.getActionName() == Actions.CLOSE) {
      k3d.component.PopOver.getInstance().setVisible(false);
    } else if (target.getActionName() == Actions.CHANGE_MODEL) {
      k3d.component.PopOver.getInstance().addChild(this.selectBox, true);
      k3d.component.PopOver.getInstance().setVisible(true);
    }
  };

  /**
   * Loads a sibling wall for the kitchen.
   * @param {boolean} next If the next wall should be loaded or previous.
   */
  _.loadSiblingWall = function(next) {
    var ci = this.data.getWallIndex(this.currentWall);
    if (ci != -1) {
      this.loadWall(ci + ((next) ? 1 : -1));
    }
  };

  /**
   * Loads a wall by its index
   * @param {number} index The wall number (index).
   */
  _.loadWall = function(index) {
    if (this.data.hasWallWithIndex(index)) {
      this.currentWall = this.data.getWall(index);
    } else {
      return;
    }

    // clear the drawing
    this.clearDrawing();

    // using the data structure find out the wall sizes and set them
    this.setWallSize(goog.asserts.assertNumber(this.currentWall.getProp(
      Struct.WIDTH)), goog.asserts.assertNumber(
        this.currentWall.getProp(Struct.HEIGHT)));

    this.visualizeItems();
  };

  /**
   * Removes all components from the drawing.
   */
  _.clearDrawing = function() {
    goog.array.forEach(this.drawsheet.removeChildren(true), function(item) {
      k3d.ds.ItemPool.getInstance().releaseObject(item);
    });
    goog.array.clear(this.topchildren_);
    goog.array.clear(this.bottomchildren_);
  };

  /**
   * Handles the action event from a component (this or a child one).
   * @param {goog.events.Event} e The ACTIVATE event.
   * @protected
   */
  _.handleActionEvent = function(e) {
    if (e.target == this.drawsheet) return;
    // assume one of the items was activated
    var target = /** @type {k3d.component.Item} */ (e.target);
    var model = target.getModel();
    // open dialog for change.
    //k3d.component.ItemView.getInstance().setModel(model);
    k3d.component.PopOver.getInstance().addChild(
      k3d.component.ItemView.getInstance(), true);
    k3d.component.ItemView.getInstance().setModel(model);
    k3d.component.PopOver.getInstance().setVisible(true);
  };


  /**
   * Sets the sizes of the wall, this should be done in the controler
   * @param {number} w The width of the wall.
   * @param {number} h The height of the wall in the room.
   * @protected
   */
  _.setWallSize = function(w, h) {
    this.width = w + (this.widthVisualOffset * 2);
    this.height = h + (this.widthVisualOffset * 2);
    if (this.drawsheet.isInDocument()) {
      this.resetSheetSize();
    }
  };

  /**
   * Show items on the wall on the drawing board.
   * @protected
   */
  _.visualizeItems = function() {
    // top row
    this.currentWall.getRow(true).forEach(function(item, idx) {
      this.addItem(item, idx, true);
    }, this);
    this.currentWall.getRow().forEach(function(item, idx) {
      this.addItem(item, idx, false);
    }, this);
  };

  /**
   * Currently undetermined how this will work exactly.
   * @param {pstj.ds.ListItem} item The data record for a cabinet / furniture.
   * @param {number} idx The index of the item in the data record list (It is
   *   possible to use the indexOf from array helpers but this seems faster).
   * @param {boolean} is_upper_row True if the item is coming from the upper
   *   row.
   */
  _.addItem = function(item, idx, is_upper_row) {

    // The original width and height (millimeters).
    var w = goog.asserts.assertNumber(item.getProp(Struct.WIDTH));
    // On Items that are on the floor there is the kickboard (130 mm) and the
    // becnhtop (50mm); Height is equal to the item's height + the kickboard
    // (130mm) + the bench top (50mm)
    var h = goog.asserts.assertNumber(item.getProp(Struct.HEIGHT)) + (
      (!is_upper_row) ? 180 : 0);

    // The width and height to set in the DOM (drawing representation).
    var width = pstj.math.utils.getPercentFromValue(w, this.width);
    var height = pstj.math.utils.getPercentFromValue(h, this.height);

    // Offset for the initial viewport gap and add the item's start position in
    // millimeters.
    var xoffset = this.currentWall.getRow(
      is_upper_row).getXOffsetByIndex(idx) + this.widthVisualOffset;
    var xoffsetperc = pstj.math.utils.getPercentFromValue(xoffset, this.width);

    var yoffsetperc;
    if (!!is_upper_row) {
      yoffsetperc = pstj.math.utils.getPercentFromValue(
        this.height - this.widthVisualOffset - this.heightOfUpperRow,
        this.height);
    } else {
      yoffsetperc = pstj.math.utils.getPercentFromValue(
        this.height - this.widthVisualOffset - h, this.height);
    }
    var child = goog.asserts.assertInstanceof(
      k3d.ds.ItemPool.getInstance().getObject(), k3d.component.Item);
    child.setModel(item);
    child.applyStyle(width, height, xoffsetperc, yoffsetperc);
    this.drawsheet.addChild(child, true);
    // Add child to list of items so we can find it easily if it is on the move.
    if (is_upper_row) {
      this.topchildren_.push(child);
    } else {
      this.bottomchildren_.push(child);
    }
  };

  /**
   * Install the editor in the DOM.
   * @param {!Element} el The element to install the editor in.
   */
  _.install = function(el) {
    this.frame.decorate(goog.dom.getElementByClass(goog.getCssName(
      'container'), el));

    this.resetSheetSize();
    this.drawsheet.decorate(goog.dom.getElementByClass(goog.getCssName(
      'child'), el));

    this.frame.addChild(this.drawsheet);

  };

  /**
   * This is called when the wall is actually changed and we want to reset the
   *   size of the sheet to 'notify' the user.
   * @protected
   */
  _.resetSheetSize = function() {
    var size = new goog.math.Size(this.width, this.height);
    goog.asserts.assertInstanceof(this.frame.size, goog.math.Size,
      'The frame size should be already set when resizing the sheet ' +
      'inside of it');
    size.scaleToFit(this.frame.size);
    this.drawsheet.setSize(size);
  };

  /**
   * Shows the selection widget with available finishes.
   */
  _.showSelectFinishes = function() {
    k3d.component.PopOver.getInstance().addChild(this.selectFinish);
    k3d.component.PopOver.getInstance().setVisible(true);
  };

  /**
   * Shows the selection widget with the available handles.
   */
  _.showSelectHandles = function() {
    k3d.component.PopOver.getInstance().addChild(this.selectHandles);
    k3d.component.PopOver.getInstance().setVisible(true);
  };

});
