import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }

  body {
    background: ${(p) => p.theme.colors.bg};
    margin: 0;
    padding: 0;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    color: ${(p) => p.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Hero */
  .hero {
    padding: 0;
    text-align: left;
  }

  /* Inputs & controls */
  .ant-input, .ant-picker input, .ant-select-selector {
    border-radius: 10px !important;
    box-shadow: 0 1px 3px rgba(16,24,40,0.03);
  }

  .ant-btn {
    border-radius: 8px;
  }

  /* Table refinements */
  .ant-table-thead > tr > th {
    background: ${(p) => p.theme.colors.headerGradient};
    border-bottom: none;
    font-weight: 700;
    color: ${(p) => p.theme.colors.text};
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: linear-gradient(90deg, rgba(11,92,255,0.03), rgba(255,122,89,0.02));
    transform: translateY(-1px);
  }

  .ant-pagination-item-active {
    border-color: ${(p) => p.theme.colors.primary};
  }

  .ant-card {
    border-radius: ${(p) => p.theme.radius};
    box-shadow: 0 8px 30px rgba(11, 22, 50, 0.06);
  }

  .ant-card .ant-card-body {
    padding: 18px;
  }
`;

export default GlobalStyles;
