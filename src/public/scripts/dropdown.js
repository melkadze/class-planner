import { DOMStrings } from "./DOMStrings.js";
const menu = {
  open(options, icon) {
    options.dataset.visibility = "visible";
    icon.src = "assets/svg/caret--up.svg";
  },
  close(options, icon) {
    options.dataset.visibility = "hidden";
    icon.src = "assets/svg/caret--down.svg";
  },
};
export { menu };
