import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    background-color: #f4f6f8;
    color: #0f172a;
    line-height: 1.6;
    font-size: 14px;
  }

  @media (max-width: 420px) {
    body {
      font-size: 13px;
    }
  }

  input, button {
    font-family: inherit;
  }

  input {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    width: 100%;
    max-width: 320px;
    font-size: 14px;
  }

  @media (max-width: 420px) {
    input {
      font-size: 13px;
    }
  }

  button {
    background: #2563eb;
    color: #fff;
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
  }

  button:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;


export default GlobalStyles;