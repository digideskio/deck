import {module} from 'angular';
import {IModalService} from 'angular-ui-bootstrap';
import {Application} from 'core/application/application.model';
import {ServerGroup} from 'core/domain/serverGroup';

class GceAddAutoHealingPolicyButtonCtrl implements ng.IComponentController {
  public application: Application;
  public serverGroup: ServerGroup;

  constructor(private $uibModal: IModalService) { 'ngInject'; }

  public addAutoHealingPolicy(): void {
    this.$uibModal.open({
      templateUrl: require('./modal/upsertAutoHealingPolicy.modal.html'),
      controller: 'gceUpsertAutoHealingPolicyModalCtrl',
      controllerAs: 'ctrl',
      size: 'md',
      resolve: {
        serverGroup: () => this.serverGroup,
        application: () => this.application,
      }
    });
  }
}

class GceAddAutoHealingPolicyButton implements ng.IComponentOptions {
  public bindings: any = {
    application: '<',
    serverGroup: '<',
  };
  public template = '<a href ng-click="$ctrl.addAutoHealingPolicy()">Create new autohealing policy</a>';
  public controller: any = GceAddAutoHealingPolicyButtonCtrl;
}

export const GCE_ADD_AUTOHEALING_POLICY_BUTTON = 'spinnaker.gce.addAutoHealingPolicyButton.component';
module(GCE_ADD_AUTOHEALING_POLICY_BUTTON, [])
  .component('gceAddAutoHealingPolicyButton', new GceAddAutoHealingPolicyButton());
