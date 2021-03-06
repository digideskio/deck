'use strict';

import { ACCOUNT_TAG_COMPONENT } from './accountTag.component';

let angular = require('angular');

module.exports = angular.module('spinnaker.core.account', [
  require('./providerToggles.directive.js'),
  ACCOUNT_TAG_COMPONENT,
]);
