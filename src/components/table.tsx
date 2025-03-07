import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Drawer,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CasinoIcon from '@mui/icons-material/Casino';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';

interface TeamTableProps {
    teams: { name: string; position: number }[];
    setTeams: React.Dispatch<React.SetStateAction<{ name: string; position: number }[]>>;
    finishedTeams: string[];
    setFinishedTeams: React.Dispatch<React.SetStateAction<string[]>>;
    toggleTeamSort: () => void;
    togglePositionSort: () => void;
    teamSort: 'asc' | 'desc' | null;
    positionSort: 'asc' | 'desc' | null;
}

const SNAKES = [10, 30, 40, 47, 54, 59, 68, 73, 78, 83, 89, 94];
const SNAKE_23 = [23];
const LADDERS_1 = [16, 31];
const LADDERS_2 = [43, 53, 60, 65];
const STOPS = [50, 100];

const TeamTable: React.FC<TeamTableProps> = ({
                                                 teams,
                                                 setTeams,
                                                 finishedTeams,
                                                 setFinishedTeams,
                                                 toggleTeamSort,
                                                 togglePositionSort,
                                                 teamSort,
                                                 positionSort,
                                             }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editTeam, setEditTeam] = useState<{ name: string; position: number } | null>(null);
    const [teamName, setTeamName] = useState('');
    const [position, setPosition] = useState<number | ''>('');

    const handleDrawerOpen = (team?: { name: string; position: number }) => {
        if (team) {
            setEditTeam(team);
            setTeamName(team.name);
            setPosition(team.position);
        } else {
            setEditTeam(null);
            setTeamName('');
            setPosition('');
        }
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditTeam(null);
        setTeamName('');
        setPosition('');
    };

    const applySnakesAndLadders = (pos: number): number => {
        if (SNAKES.includes(pos)) return pos - 2;
        if (SNAKE_23.includes(pos)) return pos - 1;
        if (LADDERS_1.includes(pos)) return pos + 1;
        if (LADDERS_2.includes(pos)) return pos + 2;
        return pos;
    };

    const handleSaveTeam = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!teamName) {
            alert('Please enter a valid team name.');
            return;
        }

        if (editTeam) {
            let newPosition = Number(position);
            if (isNaN(newPosition) || newPosition < 0 || newPosition > 101) {
                alert('Please enter a valid position between 0 and 101.');
                return;
            }
            newPosition = applySnakesAndLadders(newPosition);
            if (newPosition === 101 && !finishedTeams.includes(teamName)) {
                setFinishedTeams([...finishedTeams, teamName]);
            }
            setTeams(teams.map((t) => (t.name === editTeam.name ? { name: teamName, position: newPosition } : t)));
        } else {
            if (teams.some((t) => t.name === teamName)) {
                alert('Team name already exists.');
                return;
            }
            setTeams([...teams, { name: teamName, position: 0 }]);
        }
        handleDrawerClose();
    };

    const handleRollDice = (team: { name: string; position: number }) => {
        const roll = Number(prompt('Enter dice roll (1-6):'));
        if (isNaN(roll) || roll < 1 || roll > 6) {
            alert('Please enter a valid roll between 1 and 6.');
            return;
        }

        let newPosition = team.position + roll;
        for (const stop of STOPS) {
            if (newPosition > stop && team.position < stop) {
                newPosition = stop;
                break;
            }
        }

        if (newPosition >= 101) {
            newPosition = 101;
            if (!finishedTeams.includes(team.name)) {
                setFinishedTeams([...finishedTeams, team.name]);
            }
        }

        newPosition = applySnakesAndLadders(newPosition);
        setTeams(teams.map((t) => (t.name === team.name ? { ...t, position: newPosition } : t)));
    };

    const handleDeleteTeam = (teamName: string) => {
        setTeams(teams.filter((t) => t.name !== teamName));
        setFinishedTeams(finishedTeams.filter((t) => t !== teamName));
    };

    return (
        <Box className="team-list">
            <Typography variant="h6" gutterBottom>
                Team Positions
            </Typography>
            <TableContainer component={Paper}>
                <Table className="team-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    Team Name
                                    <IconButton onClick={toggleTeamSort}>
                                        {teamSort === 'asc' ? <ArrowUpwardIcon /> : teamSort === 'desc' ? <ArrowDownwardIcon /> : <SortIcon />}
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    Position
                                    <IconButton onClick={togglePositionSort}>
                                        {positionSort === 'asc' ? <ArrowUpwardIcon /> : positionSort === 'desc' ? <ArrowDownwardIcon /> : <SortIcon />}
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <IconButton color="primary" onClick={() => handleDrawerOpen()}>
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.length > 0 ? (
                            teams.map((team) => (
                                <TableRow key={team.name}>
                                    <TableCell>{team.name}</TableCell>
                                    <TableCell>{team.position}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDrawerOpen(team)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleRollDice(team)}>
                                            <CasinoIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteTeam(team.name)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3}>No teams available.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 300, padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {editTeam ? 'Edit Team' : 'Add Team'}
                    </Typography>
                    <form onSubmit={handleSaveTeam}>
                        <TextField
                            label="Team Name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            fullWidth
                            margin="normal"
                            disabled={!!editTeam}
                            autoFocus
                        />
                        {editTeam && (
                            <TextField
                                label="Position (0-101)"
                                type="number"
                                value={position}
                                onChange={(e) => setPosition(e.target.value === '' ? '' : Number(e.target.value))}
                                fullWidth
                                margin="normal"
                                inputProps={{ min: 0, max: 101 }}
                            />
                        )}
                        <Box mt={2}>
                            <Button type="submit" variant="contained" fullWidth>
                                Save
                            </Button>
                            <Button variant="outlined" onClick={handleDrawerClose} fullWidth sx={{ mt: 1 }}>
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Drawer>
        </Box>
    );
};

export default TeamTable;