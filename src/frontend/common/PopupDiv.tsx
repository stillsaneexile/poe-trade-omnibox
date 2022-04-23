import styled from "@emotion/styled";
import Space from "./Space";

/**
 * A fixed popup div that can be reused among various popup components in the
 * app.
 */
const PopupDiv = styled.div`
  padding: ${Space[12]} 0;
  border-radius: ${Space[4]};
  width: 50%;
  max-width: 600px;
  min-height: 300px;
  height: 500px;
  max-height: 80%;
  opacity: 0.98;
  z-index: 1000;
  overflow-y: scroll;

  // Taken from trade page.
  background-color: #1e2124;
  color: rgb(226, 226, 226);
  border: 1px solid #634928;
  font-size: 1.1em;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // This may be somewhat brittle, as we're taking this straight from their CSS.
  // I'd prefer this than copying the class names however: even if GGG changes
  // their styles, at least we'll still be fashionable, albeit retro.
  // This is literally copied from the "computed" section of inspector.
  font-family: "FontinSmallcaps", sans-serif;
`;

export default PopupDiv;
