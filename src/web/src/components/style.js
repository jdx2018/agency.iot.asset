import styled from "styled-components";

export const Block = styled.div`
  vertical-align: top;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: relative;
  /* margin: 10px 8px 0px 8px; */
  background-color: #fff;
  /* min-width: 200px;
  min-height: 150px; */
  display: inline-block;
  box-shadow: 0 2px 11px 0 rgba(190, 202, 218, 0.17);
  border: 2px #fff solid;
  border-radius: 3px;
  padding: 4px 6px;
  transition: all 250ms cubic-bezier(0.02, 0.01, 0.47, 1);
  transform: translate(0, 0);
  &:hover {
    box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15);
    transform: translate(0, -5px);
    transition-delay: 0s !important;
  }
`;
