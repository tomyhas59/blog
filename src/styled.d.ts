import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    mainColor: string;
    subColor: string;
    hoverMainColor: string;
    hoverSubColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    activeColor: string;
    charColor: string;
    top3Color: string;
    highlightColor: string;
  }
}
