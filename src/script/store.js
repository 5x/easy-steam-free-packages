import { has, isArray } from 'lodash-es';
import { MS_IN_MINUTE } from './utils';

const state = {
  operationDelay: 80000,
  packages: {
    data: {},
    registeredCount: 0,
  },
};

export function getTotalAvailablePackagesCount() {
  return Object.keys(state.packages.data).length;
}

export function getRegisteredCount() {
  return state.packages.registeredCount;
}

export function getRemainingCount() {
  return getTotalAvailablePackagesCount() - getRegisteredCount();
}

export function isRegistered(packageId) {
  return has(state.packages.data, packageId) && state.packages.data[packageId] === true;
}

export function getEstimateRemainingTimeInMinutes() {
  const remainingCount = getRemainingCount();
  return Math.round(remainingCount * state.operationDelay / MS_IN_MINUTE);
}

export function getPercentageOfCompletion() {
  return (getRegisteredCount() / getTotalAvailablePackagesCount() * 100).toFixed(2);
}

export function definePackage(packageId) {
  if (!has(state.packages.data, packageId)) {
    state.packages.data[packageId] = false;
  }
}

export function definePackagesFromArray(packagesIdsArray) {
  if (!isArray(packagesIdsArray)) {
    return;
  }

  packagesIdsArray.forEach((packageId) => {
    definePackage(packageId);
  });
}

export function registerPackage(packageId) {
  state.packages.data[packageId] = true;
  state.packages.registeredCount += 1;
}

export default state;
