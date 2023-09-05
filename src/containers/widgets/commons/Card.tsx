import { Box, Center } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import styled from "@emotion/styled";

const StyledBox = styled.div`
  border-radius: 0.25rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
`;

export function Card({ children }: { children: ReactNode }) {
  return <StyledBox>{children}</StyledBox>;
}
