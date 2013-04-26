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
  KITCHEN: 'kitchen',
  ID: 'id',
  WALLS: 'walls',
  WIDTH: 'width',
  HEIGHT: 'height',
  ATTACHED: 'is_attached_to_wall',
  ITEMS: 'items',
  TOP_ROW: 'top',
  BOTTOM_ROW: 'bottom',
  KITCHEN_PROJECT_ID: 'kitchen_project_id',
  STATUS: 'status',
  DESCRIPTION: 'description',
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
  RUNTIME: 3
};
