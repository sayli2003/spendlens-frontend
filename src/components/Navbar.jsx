import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          SpendLens
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>

          <Button color="inherit" component={Link} to="/transactions">
            Transactions
          </Button>

          <Button color="inherit" component={Link} to="/analytics">
            Analytics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;