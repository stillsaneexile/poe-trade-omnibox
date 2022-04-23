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
  margin: ${Space[16]} ${Space[24]};
  table {
    margin-top: ${Space[12]};
  }

  h3 {
    margin: ${Space[8]} 0 ${Space[4]};
  }

  b {
    color: #82786a;
  }
`;

interface HelpPageProps {
  closeBox: () => void;
}

const HelpPage: React.FC<HelpPageProps> = ({ closeBox }) => {
  return (
    <PopupDiv onBlur={closeBox}>
      <HelpContainer>
        <h2>Path of Exile Trade Site Omnibox</h2>
        Search on the trade site without touching the mouse. Press <em>;</em> to
        bring up the omnibox and start searching for filters to quickly jump to
        them and add them to your search.
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
            <b>; + "frac strength"</b>
          </li>
          <li>
            <b>; + "links"</b>: jumps to the links filters
          </li>
          <li>
            <b>; + "ax co res"</b>: finds maximum cold resistance
          </li>
        </ul>
        <h3>Bugs and Feature Requests</h3>
        Any sort of feedback can be left on
        <a
          target="_blank"
          href="https://github.com/stillsaneexile/poe-trade-omnibox"
        >
          Github
        </a>{" "}
        or{" "}
        <a target="_blank" href="https://www.reddit.com/user/iplaypathofexile/">
          Reddit
        </a>
        .
      </HelpContainer>
    </PopupDiv>
  );
};

export default HelpPage;
