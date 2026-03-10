import { GitHubCalendar } from "react-github-calendar";

const GITHUB_USERNAME = "devdev2022";

const theme = {
  light: ["#ebedf0", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7"],
};

function GithubContributionSection() {
  return (
    <div className="github-contribution">
      <GitHubCalendar
        username={GITHUB_USERNAME}
        colorScheme="light"
        theme={theme}
        blockSize={11}
        blockMargin={2}
        blockRadius={2}
        fontSize={12}
      />
    </div>
  );
}

export default GithubContributionSection;
