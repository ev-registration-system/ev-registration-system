import { Theme, ThemeProvider } from "@emotion/react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./global/Sidebar";
import Dashboard from "./views/dashboard/Dashboard";

function App() {
    const [theme, colorMode] = useMode() as [
        Theme,
        { toggleColorMode: () => void }
    ];

    return (
        <ColorModeContext.Provider value={{ toggleColorMode: colorMode.toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    {/* Global Sidebar */}
                    <Sidebar initialSelected="Home" />
                    
                    <main className="content">
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/" element={<Dashboard />} />
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
