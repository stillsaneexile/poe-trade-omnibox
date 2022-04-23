import styled from "@emotion/styled";

const HELP_SPEC = [{
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
`;

const HelpPage = () => {
  return <HelpContainer>
    <table>
      <tbody>
      {HELP_SPEC.map((item) => (<tr>
        <td>{item.key}</td>
        <td>{item.description}</td>
      </tr>))}
</tbody>
    </table>
  </HelpContainer>;
};

export default HelpPage;
