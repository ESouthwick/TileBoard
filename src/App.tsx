import { useState, useEffect } from 'react';
import { Box, CssBaseline, IconButton, ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import Board from './components/board.tsx';
import Table from './components/table.tsx';
import {
    SpaceDashboard,
    SpaceDashboardOutlined,
    TableChart,
    TableChartOutlined,
} from '@mui/icons-material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#155a9f' },
        secondary: { main: '#ff5200' },
    },
});

function App() {
    const [teams, setTeams] = useState<{ name: string; position: number }[]>(() => {
        const savedTeams = localStorage.getItem('teams');
        return savedTeams ? JSON.parse(savedTeams) : [];
    });
    const [finishedTeams, setFinishedTeams] = useState<string[]>(() => {
        const savedFinishedTeams = localStorage.getItem('finishedTeams');
        return savedFinishedTeams ? JSON.parse(savedFinishedTeams) : [];
    });
    const [teamSort, setTeamSort] = useState<'asc' | 'desc' | null>(() => {
        return localStorage.getItem('teamSort') as 'asc' | 'desc' | null || null;
    });
    const [positionSort, setPositionSort] = useState<'asc' | 'desc' | null>(() => {
        return localStorage.getItem('positionSort') as 'asc' | 'desc' | null || null;
    });
    const [showTable, setShowTable] = useState(() => {
        const savedShowTable = localStorage.getItem('showTable');
        return savedShowTable !== null ? JSON.parse(savedShowTable) : true;
    });
    const [showBoard, setShowBoard] = useState(() => {
        const savedShowBoard = localStorage.getItem('showBoard');
        return savedShowBoard !== null ? JSON.parse(savedShowBoard) : true;
    });

    useEffect(() => {
        localStorage.setItem('teams', JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        localStorage.setItem('finishedTeams', JSON.stringify(finishedTeams));
    }, [finishedTeams]);

    useEffect(() => {
        localStorage.setItem('teamSort', JSON.stringify(teamSort));
    }, [teamSort]);

    useEffect(() => {
        localStorage.setItem('positionSort', JSON.stringify(positionSort));
    }, [positionSort]);

    useEffect(() => {
        localStorage.setItem('showTable', JSON.stringify(showTable));
    }, [showTable]);

    useEffect(() => {
        localStorage.setItem('showBoard', JSON.stringify(showBoard));
    }, [showBoard]);

    const toggleTeamSort = () => {
        setPositionSort(null);
        setTeamSort(teamSort === 'desc' ? 'asc' : 'desc');
    };

    const togglePositionSort = () => {
        setTeamSort(null);
        setPositionSort(positionSort === 'desc' ? 'asc' : 'desc');
    };

    const sortedTeams = [...teams].sort((a, b) => {
        if (teamSort) {
            return teamSort === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        }
        if (positionSort) {
            return positionSort === 'desc' ? b.position - a.position : a.position - b.position;
        }
        return 0;
    });

    const handleToggleBoard = () => {
        if (showTable) {
            setShowBoard(!showBoard);
        }
    };

    const handleToggleTable = () => {
        if (showBoard) {
            setShowTable(!showTable);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
                <h1>Soulbane Tile Race 2025</h1>
                <Box
                    sx={{
                        position: 'sticky',
                        top: 20,
                        zIndex: 1000,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mb: 2,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        padding: 1,
                        borderRadius: 1,
                    }}
                >
                    <IconButton onClick={handleToggleBoard} color="primary">
                        {showBoard ? <SpaceDashboard /> : <SpaceDashboardOutlined />}
                    </IconButton>
                    <IconButton onClick={handleToggleTable} color="primary">
                        {showTable ? <TableChart /> : <TableChartOutlined />}
                    </IconButton>
                </Box>
                <div className={`main-container ${!showTable ? 'table-hidden' : ''} ${!showBoard ? 'board-hidden' : ''}`}>
                    {showBoard && <Board teams={teams} finishedTeams={finishedTeams} showTable={showTable} />}
                    {showTable && (
                        <Table
                            teams={sortedTeams}
                            setTeams={setTeams}
                            finishedTeams={finishedTeams}
                            setFinishedTeams={setFinishedTeams}
                            toggleTeamSort={toggleTeamSort}
                            togglePositionSort={togglePositionSort}
                            teamSort={teamSort}
                            positionSort={positionSort}
                        />
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;