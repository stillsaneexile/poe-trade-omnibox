/**
 * Emulates user typing in something into an input, reaching peak hackiness.
 *
 * Note that document.execCommand is technically deprecated but seems to work
 * fine on Chrome; this is a Chrome extension, so we'll lock into this platform.
 *
 * Also take a look at this (non-working) answer, which will type into Add Stat
 * input but not cause the autocomplete to update (not triggering other event
 * handlers correctly). However, in the case that execCommand stops working,
 * look here or the Chrome debugger API:
 * https://stackoverflow.com/a/69761966/892168
 */
const emulateKeyboard = (value: string, el: HTMLInputElement) => {
  document.execCommand("insertText", false, value);
};

export default emulateKeyboard;
