import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

    *,*::after,*::before{
        box-sizing:border-box;
    }
    *{
        margin:0;
        padding:0;
        font-family: 'Montserrat', sans-serif;
    }
    button,a,p{
        font-family: 'Montserrat', sans-serif;
    }
    
`;
