// cSpell:disable

import React from "react";

import { createTheme, ThemeProvider as MUThemeProvider, useColorScheme, CssBaseline } from "@mui/material";

import { useSelector } from "react-redux";



import { CacheProvider } from "@emotion/react";

import createCache from "@emotion/cache";

import rtlPlugin from "@mui/stylis-plugin-rtl";

import { prefixer } from "stylis";

const cacheRtl = createCache({

  key: "muirtl",

  stylisPlugins: [prefixer, rtlPlugin],

});



const cacheLtr = createCache({

  key: "mui",

});

const ThemeApplier = ({ children }) => {

  const { mode: themeMode } = useSelector((state) => state.theme);

  const { mode, setMode, setColorScheme } = useColorScheme();



  React.useEffect(() => {

    if (themeMode) {

      setMode(themeMode);

    }

  }, [themeMode, setMode]);



  return children;

};



const ThemeWrapper = ({ children }) => {

  const { direction } = useSelector((state) => state.language);



  const theme = React.useMemo(

    () =>

      createTheme({

        direction: direction,

        colorSchemes: {

          dark: true,

        },

      }),

    [direction],

  );

  return <MUThemeProvider theme={theme}>{children}</MUThemeProvider>;

};



export const ThemeProvider = ({ children }) => {

  return (

    <ThemeWrapper>

      <CssBaseline />

      <ThemeApplier>{children}</ThemeApplier>

    </ThemeWrapper>

  );

};



export default ThemeProvider; 

