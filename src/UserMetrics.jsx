import React from 'react';
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  LinearProgress,
  useTheme,
  createTheme,
  ThemeProvider,
  Stack,
  Divider,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbDownIcon from '@mui/icons-material/ThumbDown'; // For Reopened Rate
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // For Blocked Time

// --- Custom Dark Theme Setup ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#66bb6a', // Green
    },
    secondary: {
      main: '#ffa726', // Orange
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,
        },
      },
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                fontSize: '0.85rem',
                backgroundColor: '#2b2b2b',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: 8,
                maxWidth: 300,
                border: '1px solid #444',
            }
        }
    }
  },
});

// --- Mock Data ---
const userData = {
  userName: 'Nivi',
  githubStatus: 'Active',
  copilotStatus: 'Active',
  jiraStatus: 'Active',
  // Volume/Raw Data
  totalCommits: 58,
  totalAdditions: 4200,
  totalDeletions: 1800,
  storyPointsClosed: 120,
  totalSprints: 2,
  // Collaboration/Quality Data
  prReviewed: 15,
  reviewComments: 78,
  totalDefectsFound: 3,
  totalCodeBaseLines: 15000,
  timeToFirstReviewHrs: 4.2,
  
  // *** NEW RAW DATA POINTS ***
  storyReopenedCount: 2, // JIRA
  blockedTimeHours: 15, // JIRA
  prSubmissionLeadTimeHrs: 8.5, // GITHUB (Time from first commit to PR creation)
  refactoringSuggestionsAccepted: 150, // COPILOT
  
  // AI Adoption
  copilotLastActivity: '2 days ago',
  copilotSuggestionsAccepted: 2500,
  copilotSuggestionsOffered: 4500,
  // Flow Data
  avgCycleTime: 3.5, // Days
  jiraStories: [
    { id: 0, value: 5, label: 'Open', color: '#ef5350' },
    { id: 1, value: 12, label: 'In Progress', color: '#ffb300' },
    { id: 2, value: 45, label: 'Closed', color: '#66bb6a' },
  ],
};

// --- Calculate Derived Metrics (Formulas in Tooltips) ---
const totalLinesChanged = userData.totalAdditions + userData.totalDeletions;
const totalClosedStories = userData.jiraStories[2].value;

const NEW_METRICS = {
    // 1. AI Adoption
    copilotAcceptanceRate: ((userData.copilotSuggestionsAccepted / userData.copilotSuggestionsOffered) * 100).toFixed(1),
    refactoringAdoptionRate: ((userData.refactoringSuggestionsAccepted / userData.copilotSuggestionsAccepted) * 100).toFixed(1), // NEW
    
    // 2. Efficiency & Productivity
    commitEfficiencyRatio: (totalLinesChanged / totalClosedStories).toFixed(2),
    avgLinesPerCommit: (totalLinesChanged / userData.totalCommits).toFixed(0),
    storyPointVelocity: (userData.storyPointsClosed / userData.totalSprints).toFixed(1),
    
    // 3. Quality & Flow
    defectDensity: (userData.totalDefectsFound / (userData.totalCodeBaseLines / 1000)).toFixed(2),
    reviewEffectiveness: (userData.reviewComments / userData.prReviewed).toFixed(1),
    reopenedRate: ((userData.storyReopenedCount / totalClosedStories) * 100).toFixed(1), // NEW
    
    // 4. Collaboration & Delivery
    prCreationSpeedHrs: userData.prSubmissionLeadTimeHrs.toFixed(1), // NEW
    // Composite metric: (Lines Changed * PRs Reviewed) / Total Commits
    impactScore: ((totalLinesChanged * userData.prReviewed) / userData.totalCommits).toFixed(0), // NEW
};


// --- Reusable Components ---

const InfoTooltip = ({ explanation }) => {
  const theme = useTheme();
  return (
    <Tooltip title={
        <React.Fragment>
            <Typography color="inherit" variant="body2" sx={{ fontWeight: 'bold' }}>Metric Calculation:</Typography>
            <Typography variant="caption">{explanation}</Typography>
        </React.Fragment>
    } placement="top" arrow>
      <InfoOutlinedIcon
        sx={{
          fontSize: 16,
          color: theme.palette.text.secondary,
          cursor: 'pointer',
          ml: 0.5,
        }}
      />
    </Tooltip>
  );
};

const MetricCard = ({ title, value, unit, explanation, icon: Icon, color, isCalculated = false }) => {
  const theme = useTheme();
  // Using a distinct color scheme for calculated metrics for visual separation
  const cardColor = isCalculated ? '#212B36' : theme.palette.background.paper; 
  const borderColor = color;

  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: cardColor,
        p: 2,
        borderLeft: `4px solid ${borderColor}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      <CardContent sx={{ p: '8px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 'medium',
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: theme.palette.text.secondary,
            }}
          >
            {title}
          </Typography>
          <InfoTooltip explanation={explanation} />
        </Box>
        <Stack direction="row" alignItems="flex-end" spacing={1}>
            {Icon && <Icon sx={{ fontSize: 32, color: color }} />}
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {value}
            </Typography>
            {unit && (
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: '2px' }}>
                {unit}
            </Typography>
            )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const StatusChip = ({ status }) => {
  const colorMap = {
    Active: '#66bb6a',
    Inactive: '#ef5350',
    Unknown: '#ffb300',
  };
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: colorMap[status] || '#555',
        color: theme.palette.background.default,
        borderRadius: 4,
        px: 1.5,
        py: 0.5,
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        minWidth: '70px',
        textAlign: 'center',
      }}
    >
      {status}
    </Box>
  );
};

// Utility function to convert polar coordinates to Cartesian coordinates
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

// Custom SVG Semi-Pie Chart Component
const SemiPieChart = ({ data, radius, totalValue }) => {
    const theme = useTheme();
    const size = radius * 2.2;
    const centerX = radius * 1.1;
    const centerY = radius * 1.1;
    const innerRadius = radius * 0.5;

    let cumulativeAngle = 0;
    const paths = [];

    data.forEach((slice, index) => {
        const percentage = slice.value / totalValue;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + (percentage * 180);

        if (percentage > 0) {
            const startOuter = polarToCartesian(centerX, centerY, radius, startAngle);
            const endOuter = polarToCartesian(centerX, centerY, radius, endAngle);
            const startInner = polarToCartesian(centerX, centerY, innerRadius, startAngle);
            const endInner = polarToCartesian(centerX, centerY, innerRadius, endAngle);

            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

            const pathData = [
                // Move to start of outer arc
                `M ${startOuter.x} ${startOuter.y}`,
                // Draw outer arc
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
                // Draw line to end of inner arc
                `L ${endInner.x} ${endInner.y}`,
                // Draw inner arc (reversed direction)
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
                // Close path (line back to start of outer arc)
                `Z`
            ].join(' ');

            paths.push(
                <path
                    key={index}
                    d={pathData}
                    fill={slice.color}
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                />
            );
        }

        cumulativeAngle = endAngle;
    });

    // Determine legend items
    const legend = data.map((slice, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 2 } }}>
            <Box sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: slice.color,
                mr: 1,
            }} />
            <Typography variant="body2" color="text.primary">
                {slice.label} ({slice.value})
            </Typography>
        </Box>
    ));


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, height: '100%', minHeight: 250 }}>
            <svg width={size} height={centerY + 5} viewBox={`0 0 ${size} ${centerY + 5}`} style={{ overflow: 'visible' }}>
                {paths}
            </svg>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: { xs: 2, sm: 3 }, mb: 1 }}>
                {legend}
            </Box>
        </Box>
    );
};


// --- Main App Component ---
const UserMetrics = () => {
  const totalStories = userData.jiraStories.reduce((sum, item) => sum + item.value, 0);
  const theme = useTheme();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: darkTheme.palette.background.default,
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Card
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: darkTheme.palette.background.paper,
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'light', color: darkTheme.palette.primary.main }}>
              User Metrics Dashboard
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkTheme.palette.text.primary }}>
              {userData.userName}
            </Typography>
          </Card>

          {/* Status Row */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: darkTheme.palette.text.secondary }}>GitHub Status:</Typography>
                <StatusChip status={userData.githubStatus} />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: darkTheme.palette.text.secondary }}>Copilot Status:</Typography>
                <StatusChip status={userData.copilotStatus} />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ color: darkTheme.palette.text.secondary }}>JIRA Status:</Typography>
                <StatusChip status={userData.jiraStatus} />
              </Card>
            </Grid>
          </Grid>

          {/* === SECTION 1: PRODUCTIVITY & VELOCITY (GitHub/JIRA Volume) === */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
            Productivity & Velocity (Output Volume)
          </Typography>
          <Divider sx={{ mb: 3, backgroundColor: theme.palette.text.secondary }} />

          <Grid container spacing={3} mb={4}>
            {/* Raw Commit Data */}
            <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                    title="Total Commits"
                    value={userData.totalCommits}
                    unit="Commits"
                    explanation="The raw count of total Git commits pushed by the user in the time period."
                    icon={CodeIcon}
                    color="#03a9f4"
                />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                    title="Total Lines Changed"
                    value={(userData.totalAdditions + userData.totalDeletions).toLocaleString()}
                    unit="Lines"
                    explanation="The sum of all lines added and deleted. (Measure of total coding effort volume)"
                    icon={CodeIcon}
                    color="#4caf50"
                />
            </Grid>
            {/* Calculated Metrics */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Story Point Velocity"
                value={NEW_METRICS.storyPointVelocity}
                unit="Points/Sprint"
                explanation="Calculation: (Total Story Points Closed) / (Total Sprints Completed). A measure of team output predictability."
                icon={TrendingUpIcon}
                color="#8e24aa"
                isCalculated={true}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Avg Lines Per Commit"
                value={NEW_METRICS.avgLinesPerCommit}
                unit="Lines/Commit"
                explanation="Calculation: (Total Additions + Total Deletions) / (Total Commits). A proxy for commit size; indicates frequency of check-ins."
                icon={CodeIcon}
                color="#00bcd4"
                isCalculated={true}
              />
            </Grid>
          </Grid>
          
          {/* === SECTION 2: FLOW & QUALITY (JIRA/Defect Focus) === */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
            Flow & Quality (JIRA/Defect Focus)
          </Typography>
          <Divider sx={{ mb: 3, backgroundColor: theme.palette.text.secondary }} />

          <Grid container spacing={3} mb={4}>
            {/* Flow Metrics */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Avg Story Cycle Time"
                value={userData.avgCycleTime}
                unit="Days"
                explanation="Calculation: Average duration a story spends between 'In Progress' and 'Closed' status. Key for workflow predictability."
                icon={TimelineIcon}
                color="#3f51b5" // Indigo
              />
            </Grid>
            {/* NEW JIRA Metric: Total Blocked Time */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Total Blocked Time"
                value={userData.blockedTimeHours}
                unit="Hours"
                explanation="Calculation: Cumulative time a story was in a 'Blocked' or 'Waiting' status. Measures impediments encountered by the individual."
                icon={AccessTimeIcon}
                color="#e57373" // Light Red
              />
            </Grid>
            {/* Quality Metrics */}
            <Grid item xs={12} sm={6} lg={3}>
             <MetricCard
                title="Defect Density"
                value={NEW_METRICS.defectDensity}
                unit="Defects/1K LOC"
                explanation="Calculation: (Total Defects Found) / (Total Lines of Code / 1000). A high value indicates lower code quality."
                icon={BugReportIcon}
                color="#c62828" // Dark Red
                isCalculated={true}
              />
            </Grid>
             {/* NEW JIRA Metric: Reopened Story Rate */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Reopened Story Rate"
                value={`${NEW_METRICS.reopenedRate}%`}
                unit="Rate"
                explanation="Calculation: (Stories Reopened) / (Total Stories Closed) * 100. Measures completeness and quality of delivery."
                icon={ThumbDownIcon}
                color="#ffb300" // Orange
                isCalculated={true}
              />
            </Grid>
          </Grid>

          {/* === SECTION 3: COLLABORATION & DELIVERY (GitHub PR Focus) === */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
            Collaboration & Delivery (GitHub PR Focus)
          </Typography>
          <Divider sx={{ mb: 3, backgroundColor: theme.palette.text.secondary }} />

          <Grid container spacing={3} mb={4}>
            {/* Raw Review Data */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="PR Review Contribution"
                value={`${userData.prReviewed} / ${userData.reviewComments}`}
                unit="PRs/Comments"
                explanation="Raw count of Total Pull Requests Reviewed and Total Comments Provided. Measures contribution to team code quality."
                icon={VisibilityIcon}
                color={darkTheme.palette.secondary.main}
              />
            </Grid>
            {/* Calculated Review Effectiveness */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Review Effectiveness"
                value={NEW_METRICS.reviewEffectiveness}
                unit="Comments/PR"
                explanation="Calculation: (Total Review Comments) / (Total PRs Reviewed). A higher value suggests more detailed code review feedback."
                icon={VisibilityIcon}
                color="#4dd0e1" // Light Cyan
                isCalculated={true}
              />
            </Grid>
             {/* NEW GITHUB Metric: PR Submission Lead Time */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="PR Submission Lead Time"
                value={NEW_METRICS.prCreationSpeedHrs}
                unit="Hours"
                explanation="Calculation: Average time from the first commit on a branch to the Pull Request being opened. Measures speed of work packaging."
                icon={HourglassEmptyIcon}
                color="#ff9800"
              />
            </Grid>
            {/* NEW GITHUB Metric: Code Impact Score */}
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title="Code Impact Score"
                value={NEW_METRICS.impactScore}
                unit="Weighted Score"
                explanation="Calculation: (Total Lines Changed * Total PRs Reviewed) / (Total Commits). A composite score attempting to quantify delivery velocity combined with quality contribution."
                icon={SpeedIcon}
                color="#ff7043"
                isCalculated={true}
              />
            </Grid>
          </Grid>

          {/* === SECTION 4: AI ADOPTION (Copilot Focus) & CHART === */}
          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
            AI Adoption & Workflow Status
          </Typography>
          <Divider sx={{ mb: 3, backgroundColor: theme.palette.text.secondary }} />
          
          <Grid container spacing={3} mb={4}>
            {/* AI Adoption Card 1 (Acceptance Rate) */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: darkTheme.palette.background.paper,
                  p: 2,
                  borderLeft: `4px solid ${darkTheme.palette.primary.main}`,
                }}
              >
                <CardContent sx={{ p: '8px !important' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 'medium',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: darkTheme.palette.text.secondary,
                      }}
                    >
                      Copilot Acceptance Rate
                    </Typography>
                    <InfoTooltip
                      explanation="Calculation: (Total Suggestions Accepted) / (Total Suggestions Offered) * 100. Indicates effective AI utilization and trust in Copilot."
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1.5, color: darkTheme.palette.primary.main }}>
                    {NEW_METRICS.copilotAcceptanceRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(NEW_METRICS.copilotAcceptanceRate)}
                    color="primary"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={1}>
                    {userData.copilotSuggestionsAccepted.toLocaleString()} accepted out of {userData.copilotSuggestionsOffered.toLocaleString()}
                  </Typography>
                   <Box sx={{ mt: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <InsightsIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                            Last Used: {userData.copilotLastActivity}
                        </Typography>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* NEW AI Adoption Card 2 (Refactoring Rate) */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: darkTheme.palette.background.paper,
                  p: 2,
                  borderLeft: `4px solid #ff4081`, // Pink
                }}
              >
                <CardContent sx={{ p: '8px !important' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 'medium',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        color: darkTheme.palette.text.secondary,
                      }}
                    >
                      Refactoring Adoption Rate
                    </Typography>
                    <InfoTooltip
                      explanation="Calculation: (Refactoring Suggestions Accepted) / (Total Suggestions Accepted) * 100. Measures the reliance on Copilot for quality improvements and code cleanup."
                    />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1.5, color: '#ff4081' }}>
                    {NEW_METRICS.refactoringAdoptionRate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(NEW_METRICS.refactoringAdoptionRate)}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: '#424242', '& .MuiLinearProgress-bar': { backgroundColor: '#ff4081' } }}
                  />
                  <Typography variant="caption" color="text.secondary" mt={1}>
                    {userData.refactoringSuggestionsAccepted.toLocaleString()} refactoring suggestions accepted.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* JIRA Stories Semi-Pie Chart */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, minHeight: 350, backgroundColor: darkTheme.palette.background.paper }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: darkTheme.palette.text.primary }}>
                            JIRA Story Completion Status (Total: {totalStories})
                        </Typography>
                        <InfoTooltip
                            explanation="Calculation: Raw count of stories in each status (Open, In Progress, Closed) divided by the total count of assigned stories."
                        />
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', height: '300px' }}>
                        <SemiPieChart
                            data={userData.jiraStories}
                            radius={100}
                            totalValue={totalStories}
                        />
                    </Box>
                </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserMetrics;
