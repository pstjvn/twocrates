goog.provide('k3d.ds.definitions');

goog.require('goog.asserts');
goog.require('pstj.configure');

/**
 * @fileoverview Provides the system wide configuration options.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

k3d.ds.definitions.PathsPrefix = 'TWOCRATES.PATHS';

/**
 * The heoght of the header in pixels.
 * @type {number}
 */
k3d.ds.definitions.headerHeight = 45;

/**
 * Provides symbol names for the URL paths used in the app.
 * @enum {string}
 */
k3d.ds.definitions.Path = {
  LOAD_KITCHEN: goog.asserts.assertString(pstj.configure.getRuntimeValue(
    'LOAD_KITCHEN', '/loadKitchen', k3d.ds.definitions.PathsPrefix)),
  SAVE_KITCHEN: goog.asserts.assertString(pstj.configure.getRuntimeValue(
    'SAVE_KITCHEN', '/saveKitchen', k3d.ds.definitions.PathsPrefix)),
  LOAD_FINISHES: goog.asserts.assertString(pstj.configure.getRuntimeValue(
    'LOAD_FINISHES', '/getFinishes', k3d.ds.definitions.PathsPrefix)),
  LOAD_ITEMS: goog.asserts.assertString(pstj.configure.getRuntimeValue(
    'LOAD_ITEMS', '/getItems', k3d.ds.definitions.PathsPrefix)),
  LOAD_HANDLES: goog.asserts.assertString(pstj.configure.getRuntimeValue(
    'LOAD_HANDLES', '/getHandles', k3d.ds.definitions.PathsPrefix))
};

/**
 * Provides the structure names as symbols.
 * @enum {string}
 */
k3d.ds.definitions.Struct = {
  ID: 'id',
  // The item is designed to be used next to a wall (single fron view)
  ATTACHED: 'is_attached_to_wall',
  // Short description to display on detail page
  DESCRIPTION: 'description',
  // the category ID, thees need to be clarified.
  CATEGORY: 'category_id',
  // the width of the item.
  WIDTH: 'width',
  // on items with two walls (corner items) the second wall (right) width
  WIDTH2: 'width2',
  // the height of the item
  HEIGHT: 'height',
  // depth of the item, used only in stone bench calculations.
  DEPTH: 'depth',
  // image of the item in front view
  DRAWING_IMAGE: 'front_picture',
  // Image of the item in side view
  SIDE_IMAGE: 'angle_picture',
  // THe item requires to be covered on top by the stone bench
  USE_TOP_BOARD: 'has_top_board',
  // THe model ID (number).
  MODEL: 'model_id',
  // the item is actually a spacer
  ISSPACE: 'is_spacer',
  // price in cents
  PRICE: 'price',
  // number of handles to use with this item
  HANDLES: 'required_handles',
  // The picture of finishes and handles to use.
  PICTURE: 'picture',
  // The dimentions of the handles ("XxY")
  DIMENTIONS: 'dimentions',
  // The color of the finish when it is not pattern.
  COLOR: 'color',
  //----- Data structure names ----//
  //Kitchen record.
  KITCHEN: 'data',
  // walls list
  WALLS: 'walls',
  // walls items list
  ITEMS: 'items',
  // top row in a wall
  TOP_ROW: 'top',
  // bottom row in a wall
  BOTTOM_ROW: 'bottom',
  // the parameter for the kitchen project id.
  KITCHEN_PROJECT_ID: 'kitchen_project_id',
  // Status of the server respnse (0 -> 99)
  STATUS: 'status',
  // THe error message attached to a non 0 server response.
  ERROR_MESSAGE: 'message',
  // The payload of a response.
  DATA: 'data'
};

/**
 * THe static string used for errors.
 * TODO: this should actually be implemented as templates instead
 * @enum {number}
 */
k3d.ds.definitions.Static = {
  SERVER_HTTP_ERROR: 0,
  UNPARSABLE_JSON: 1,
  STRUCTURED_ERROR: 2,
  RUNTIME: 3,
  NO_DATA: 4
};
