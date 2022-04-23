import styled from "@emotion/styled";
import PopupDiv from "../common/PopupDiv";
import Space from "../common/Space";

const HELP_SPEC = [
  {
    key: "/",
    description: "Highlight the main search box",
  },
  {
    key: ";",
    description: "Open the omnibox",
  },
  {
    key: "=",
    description: "Clear the search page",
  },
  {
    key: "[",
    description: "Cycle through added stat filters",
  },
  {
    key: "?",
    description: "Open the help dialog",
  },
];

const HelpContainer = styled.div`
  margin: ${Space[24]};
  table {
    margin-top: ${Space[12]};
  }
`;

interface HelpPageProps {
  closeBox: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ closeBox }) => {
  return (
    <PopupDiv onBlur={closeBox}>
      <HelpContainer>
        <h3>Hotkeys</h3>
        <table>
          <tbody>
            {HELP_SPEC.map((item) => (
              <tr>
                <td style={{ width: Space[24] }}>
                  <b>{item.key}</b>
                </td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Examples</h3>
        <ul>
          <li>
            <b>;</b> + <b>frac strength</b>
          </li>
          <li>
            <b>;</b> + <b>links</b> jumps to the links filters
          </li>
          <li>
            <b>;</b> + <b>ax co res</b> yields maximum cold resistance (as an
            example of the matching)
          </li>
        </ul>
        <h3>Bugs and feature requests</h3>
        Any sort of feedback can be left on Github
        <a
          target="_blank"
          href="https://github.com/stillsaneexile/poe-trade-omnibox"
        >
          Github
        </a>{" "}
        or
        <a target="_blank" href="https://www.reddit.com/user/iplaypathofexile/">
          reddit
        </a>
        .
      </HelpContainer>
    </PopupDiv>
  );
};

export default HelpPage;
