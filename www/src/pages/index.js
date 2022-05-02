import * as React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Everything from "./everything";
import { Container } from "@mui/material";
import ThreeDebug from "./three-debug";
import { damping } from "../damping";
import { marking } from "../marking";
// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

// markup
const IndexPage = () => {
  return (
    <main style={pageStyles}>
      <Container>
        <ThreeDebug width={1000} height={1000} eff={damping} />
        {/*<ThreeDebug eff={damping} width={758} height={512} />*/}
      </Container>
      {/*<Everything />*/}
    </main>
  );
};

export default IndexPage;
