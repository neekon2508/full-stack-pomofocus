export const getBgColor = (theme, active) => {
  switch (active) {
    case 0:
      return theme.palette.custom.pomodoro;
    case 1:
      return theme.palette.custom.shortBreak;
    case 2:
      return theme.palette.custom.longBreak;
    default:
      return theme.palette.background.default;
  }
};
