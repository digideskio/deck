import {module, IComponentOptions, IComponentController} from 'angular';
import {get} from 'lodash';
import * as moment from 'moment';

import {Application} from 'core/application/application.model';
import {TaskStep, InstanceCounts, IStage, ITimedItem} from 'core/domain/index';
import {ITask} from './task.read.service';

class PlatformHealthOverrideMessageController implements IComponentController {
  public showMessage: boolean;
  public messageTemplate = require('./platformHealthOverrideMessage.html');
  private application: Application;
  private step: TaskStep;
  private task: ITask;

  public $onInit(): void {
    const lastCapacity: InstanceCounts = this.task.getValueFor('lastCapacityCheck');
    if (lastCapacity) {
      const lastCapacityTotal = lastCapacity.up + lastCapacity.down +
        lastCapacity.outOfService + lastCapacity.unknown + lastCapacity.succeeded + lastCapacity.failed;

      // Confirm that a). we're stuck on a clone or create task (not, e.g., an enable task)
      // and b). the step we're stuck on is within that clone or create task.
      const isRelevantTask: boolean = this.task.execution.stages
        .some((stage: IStage) => {
          return (stage.type === 'cloneServerGroup' || stage.type === 'createServerGroup') &&
            stage.tasks.some((task: ITimedItem) => task.startTime === this.step.startTime);
        });

      this.showMessage = (isRelevantTask &&
        this.step.name === 'waitForUpInstances' &&
        this.step.runningTimeInMs > moment.duration(5, 'minutes').asMilliseconds() &&
        lastCapacity.unknown > 0 &&
        lastCapacity.unknown === lastCapacityTotal &&
        !get(this.application, 'attributes.platformHealthOnly'));
    }
  }
}

class PlatformHealthOverrideMessage implements IComponentOptions {
  public bindings: any = {
    application: '<',
    step: '<',
    task: '<'
  };
  public controller = PlatformHealthOverrideMessageController;
  public template = `<i ng-if="$ctrl.showMessage"
                        uib-tooltip-template="::$ctrl.messageTemplate"
                        class="fa fa-exclamation-circle" style="font-size: smaller;"></i>`;
}

export const PLATFORM_HEALTH_OVERRIDE_MESSAGE = 'spinnaker.core.platformHealthOverrideMessage.component';
module(PLATFORM_HEALTH_OVERRIDE_MESSAGE, []).component('platformHealthOverrideMessage', new PlatformHealthOverrideMessage());
