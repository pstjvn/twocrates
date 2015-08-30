/**
 * @fileoverview Provides the testing bed for our project. In this file one
 *   can occlude the already working parts and invoke only the new development
 *   parts.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('test');

goog.require('k3d.control.Main');


/** Exported NS */
test = function() {
  (new k3d.control.Main());
};
