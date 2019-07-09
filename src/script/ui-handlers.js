/* global ShowBlockingWaitDialog */
/* global ShowAlertDialog */
import { noop } from 'lodash-es';

import {
  getPercentageOfCompletion,
  getRegisteredCount,
  getTotalAvailablePackagesCount,
  getEstimateRemainingTimeInMinutes,
} from './store';

let modal = {
  Dismiss: noop,
};

export function renderProcessingDialog() {
  modal.Dismiss();
  modal = ShowBlockingWaitDialog(
    'Loading...',
    'Processing existing products in your account.',
  );
}

export function renderCurrentStateInformation() {
  modal.Dismiss();
  modal = ShowBlockingWaitDialog(
    `[${getPercentageOfCompletion()}%] Please wait…`,
    `To you account has been added <b>${getRegisteredCount()}</b>/${getTotalAvailablePackagesCount()} licenses.
    Time remaining: About ${getEstimateRemainingTimeInMinutes()} minutes.`,
  );
}

export function renderCompletedDialog() {
  ShowAlertDialog(
    '[100%] Completed!',
    'Now in your Steam account registered all available free licenses.',
    'Reload page',
  ).done(() => {
    window.location.reload();
  });
}
