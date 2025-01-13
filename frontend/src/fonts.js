import { createGlobalStyle } from 'styled-components';
import AaWeiWeiDianZhenTiFont from './fonts/AaWeiWeiDianZhenTi-2.ttf';

export const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'AaWeiWeiDianZhenTi';
    src: url(${AaWeiWeiDianZhenTiFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`; 