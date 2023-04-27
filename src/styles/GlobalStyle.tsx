import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset}
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        letter-spacing: -0.25px;
        line-height: 1.2;
    }
    html, body, #__next {
        height: 100%;
    }
    body{
        /* font-family: Pretendard, -apple-system, 'Apple SD Gothic Neo','Malgun Gothic', sans-serif; */
        font-weight: 400;
        /* overflow: hidden; */
        overflow: overlay;
        /* overflow: auto; */
  
        -webkit-font-smoothing: antialiased;

        ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        border-radius: 2px;
        }
        ::-webkit-scrollbar:hover {
        background: transparent;
        }

        ::-webkit-scrollbar-track {
        border-radius: 2px;
        }

        ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #d6d6d7;
        }
    }
    
    button {
      border: none;
      background: none;
      cursor: pointer;
    }

`;

export default GlobalStyle;
