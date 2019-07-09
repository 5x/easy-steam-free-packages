/* global jQuery */
/* global g_sessionID */
import freePackages from './default_packages_db.json';
import { escapeStringRegExp } from './utils';
import state, { definePackagesFromArray, registerPackage, isRegistered } from './store';
import { renderCurrentStateInformation, renderProcessingDialog, renderCompletedDialog } from './ui-handlers';

const CHECKOUT_URL = 'https://store.steampowered.com/checkout/addfreelicense';
const PAGE_DESTINATION_URL = 'https://store.steampowered.com/account/licenses/';

const requiredPageLocationAddress = escapeStringRegExp(PAGE_DESTINATION_URL);
const locationRe = new RegExp(`^${requiredPageLocationAddress}?$`);

if (window.location.href.match(locationRe) === null || !jQuery('#account_pulldown').length) {
  alert(`Please login to you account in this browser and run this on Steam's account page details: ${PAGE_DESTINATION_URL}`);
  window.location = PAGE_DESTINATION_URL;
}

function loadExistingProducts() {
  const linkRegEx = /javascript:RemoveFreeLicense\( ([0-9]+), '/;

  jQuery('.account_table a').each((index, element) => {
    const match = element.href.match(linkRegEx);

    if (match !== null) {
      const packageId = +match[1];
      registerPackage(packageId);
    }
  });
}

function registerPackageToUserAccount(packageId) {
  const settings = {
    action: 'add_to_cart',
    sessionid: g_sessionID,
    subid: packageId,
  };

  jQuery.post(CHECKOUT_URL, settings)
    .done(() => {
      registerPackage(packageId);
      renderCurrentStateInformation();
    });
}

function addFreePackagesToAccount() {
  Object.keys(state.packages.data).reduce((accumulator, packageId) => {
    if (isRegistered(packageId)) {
      return accumulator;
    }

    const timeout = accumulator * state.operationDelay;
    setTimeout(registerPackageToUserAccount, timeout, packageId);

    return accumulator + 1;
  }, 0);
}

renderProcessingDialog();
definePackagesFromArray(freePackages.packages);
loadExistingProducts();
addFreePackagesToAccount();
renderCompletedDialog();
