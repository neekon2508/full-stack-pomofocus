import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";

export default function Summary() {
  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "rgb(255,255,255,0.1)",
        marginTop: "20px",
        borderTop: "1px solid white",
      }}
      justifyItems="center"
    >
      <Stack direction="row" color="white">
        <Typography variant="body1" paddingRight="20px">
          <span style={{ marginRight: "8px" }}>Pomos:</span>
          <span style={{ fontWeight: "bold" }}>51</span>
          <span style={{ fontWeight: "bold" }}> / 165</span>
        </Typography>
        <Typography variant="body1">
          <span style={{ marginRight: "8px" }}>Finish At:</span>
          <span style={{ fontWeight: "bold" }}>PM 2:26</span>
          <span style={{ fontWeight: "bold" }}>(61.5h)</span>
        </Typography>
      </Stack>
    </Box>
  );
}
