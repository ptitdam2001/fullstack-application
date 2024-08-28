import classNames, { ArgumentArray } from 'classnames';
import { twMerge } from 'tailwind-merge';

/**
 * Merges classes using classnames and tailwind-merge
 * @example
 * clsxMerge('text-red-500', 'text-2xl', 'font-bold', 'text-center')
 * // => 'text-red-500 text-2xl font-bold text-center'
 * @param classes {ClassValue[]} - Array of classes to merge
 * @returns {string}
 */
export const classnameMerge = (...classes: ArgumentArray): string =>
  twMerge(classNames(...classes));
