'use strict';

let angular = require('angular');

import {ACCOUNT_SERVICE} from 'core/account/account.service';
import {SERVER_GROUP_WRITER} from 'core/serverGroup/serverGroupWriter.service';
import {TASK_MONITOR_BUILDER} from 'core/task/monitor/taskMonitor.builder';

module.exports = angular.module('spinnaker.cf.serverGroup.details.rollback.controller', [
      ACCOUNT_SERVICE,
      require('core/application/modal/platformHealthOverride.directive.js'),
      require('core/task/modal/reason.directive.js'),
      SERVER_GROUP_WRITER,
      TASK_MONITOR_BUILDER,
      require('../../../common/footer.directive.js'),
])
    .controller('cfRollbackServerGroupCtrl', function ($scope, $uibModalInstance, serverGroupWriter,
                                                       taskMonitorBuilder,
                                                       application, serverGroup, disabledServerGroups) {
      $scope.serverGroup = serverGroup;
      $scope.disabledServerGroups = disabledServerGroups.sort((a, b) => b.name.localeCompare(a.name));
      $scope.verification = {};

      $scope.command = {
        rollbackType: 'EXPLICIT',
        rollbackContext: {
          rollbackServerGroupName: serverGroup.name
        },
        region: serverGroup.region,
      };

      if (application && application.attributes) {
        $scope.command.platformHealthOnlyShowOverride = application.attributes.platformHealthOnlyShowOverride;
        $scope.command.interestingHealthProviderNames = ['Cloud Foundry'];
      }

      this.isValid = function () {
        var command = $scope.command;
        if (!$scope.verification.verified) {
          return false;
        }

        return command.rollbackContext.restoreServerGroupName !== undefined;
      };

      $scope.taskMonitor = taskMonitorBuilder.buildTaskMonitor({
        application: application,
        title: 'Rollback ' + serverGroup.name,
        modalInstance: $uibModalInstance,
      });

      this.rollback = function () {
        this.submitting = true;
        if (!this.isValid()) {
          return;
        }

        var submitMethod = function () {
          return serverGroupWriter.rollbackServerGroup(serverGroup, application, $scope.command);
        };

        $scope.taskMonitor.submit(submitMethod);
      };

      this.cancel = function () {
        $uibModalInstance.dismiss();
      };
    });
