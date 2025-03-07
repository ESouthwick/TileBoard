import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { Box, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface BoardProps {
    teams: { name: string; position: number }[];
    finishedTeams: string[];
    showTable: boolean;
}

const TILE_SIZE_NORMAL = 60;
const TILE_SIZE_LARGE = 60;
const BOARD_WIDTH_NORMAL = 10;
const BOARD_WIDTH_LARGE = 20;
const BOARD_HEIGHT = 10;
const TOTAL_MAIN_TILES = BOARD_WIDTH_NORMAL * BOARD_HEIGHT;
const TEXT_SIZE = 12;

const SNAKES = [10, 30, 40, 47, 54, 59, 68, 73, 78, 83, 89, 94];
const SNAKE_23 = [23];
const LADDERS_1 = [16, 31];
const LADDERS_2 = [43, 53, 60, 65];

const Board: React.FC<BoardProps> = ({ teams, finishedTeams, showTable }) => {
    const TILE_SIZE = showTable ? TILE_SIZE_NORMAL : TILE_SIZE_LARGE;
    const BOARD_WIDTH = showTable ? BOARD_WIDTH_NORMAL : BOARD_WIDTH_LARGE;
    const ROW_TILES = BOARD_WIDTH; // Number of tiles per row (10 or 20)
    const ROW_COUNT = TOTAL_MAIN_TILES / ROW_TILES; // Number of rows (10 or 5)
    const stageWidth = TILE_SIZE * BOARD_WIDTH;
    const stageHeight = TILE_SIZE * (ROW_COUNT + 2);

    const [showStartList, setShowStartList] = useState(() => {
        const saved = localStorage.getItem('showStartList');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [showFinishList, setShowFinishList] = useState(() => {
        const saved = localStorage.getItem('showFinishList');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('showStartList', JSON.stringify(showStartList));
    }, [showStartList]);

    useEffect(() => {
        localStorage.setItem('showFinishList', JSON.stringify(showFinishList));
    }, [showFinishList]);

    return (
        <Box sx={{ position: 'relative' }}>
            <Stage width={stageWidth} height={stageHeight} className="board">
                <Layer>
                    {Array.from({ length: TOTAL_MAIN_TILES }, (_, index) => {
                        const tileNum = index + 1;

                        // Map to display coordinates with zig-zag
                        const displayRow = Math.floor(index / ROW_TILES); // 0-9 (10-wide) or 0-4 (20-wide)
                        const rowTilesIndex = index % ROW_TILES; // 0-9 or 0-19
                        const isEvenRow = displayRow % 2 === 0;
                        const displayCol = isEvenRow ? rowTilesIndex : ROW_TILES - 1 - rowTilesIndex;

                        const x = displayCol * TILE_SIZE;
                        const y = (ROW_COUNT - 1 - displayRow) * TILE_SIZE;

                        return (
                            <React.Fragment key={tileNum}>
                                <Rect
                                    x={x}
                                    y={y}
                                    width={TILE_SIZE}
                                    height={TILE_SIZE}
                                    fill={
                                        SNAKES.includes(tileNum) || SNAKE_23.includes(tileNum)
                                            ? '#ff5722'
                                            : LADDERS_1.includes(tileNum) || LADDERS_2.includes(tileNum)
                                                ? '#4caf50'
                                                : tileNum === 50 || tileNum === 100
                                                    ? '#000000'
                                                    : '#155a9f'
                                    }
                                    stroke="#cacaca"
                                    strokeWidth={1}
                                    shadowColor="rgba(0, 0, 0, 0.5)"
                                    shadowBlur={5}
                                    shadowOffset={{ x: 2, y: 2 }}
                                    cornerRadius={5}
                                />
                                <Text
                                    x={x + TILE_SIZE / 2 - 10}
                                    y={y + TILE_SIZE / 2 - 10}
                                    text={tileNum.toString()}
                                    fontSize={TEXT_SIZE}
                                    fill="white"
                                    align="center"
                                />
                                {teams
                                    .filter((team) => team.position === tileNum)
                                    .map((team, idx) => (
                                        <Text
                                            key={team.name}
                                            x={x + 5}
                                            y={y + 5 + idx * TEXT_SIZE}
                                            text={team.name}
                                            fontSize={TEXT_SIZE}
                                            fill="black"
                                            padding={2}
                                            cornerRadius={3}
                                            fillAfterStrokeEnabled
                                            stroke="rgb(255, 82, 18)"
                                            strokeWidth={2}
                                        />
                                    ))}
                            </React.Fragment>
                        );
                    })}
                </Layer>
            </Stage>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: TILE_SIZE * 2,
                    bgcolor: '#009300',
                    border: '1px solid #cacaca',
                    borderRadius: 1,
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                    <Typography variant="subtitle2" color="white">
                        Start
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setShowStartList(!showStartList)}
                        color="inherit"
                    >
                        {showStartList ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Box>
                {showStartList && (
                    <List dense sx={{ maxHeight: TILE_SIZE * 2, overflowY: 'auto', bgcolor: '#009300' }}>
                        {teams
                            .filter((team) => team.position === 0)
                            .map((team) => (
                                <ListItem key={team.name} sx={{ py: 0 }}>
                                    <ListItemText primary={team.name} primaryTypographyProps={{ fontSize: TEXT_SIZE, color: 'black' }} />
                                </ListItem>
                            ))}
                    </List>
                )}
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: TILE_SIZE * 2,
                    width: TILE_SIZE * 2,
                    bgcolor: '#ff2500',
                    border: '1px solid #cacaca',
                    borderRadius: 1,
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0.5 }}>
                    <Typography variant="subtitle2" color="white">
                        Finish
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setShowFinishList(!showFinishList)}
                        color="inherit"
                    >
                        {showFinishList ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Box>
                {showFinishList && (
                    <List dense sx={{ maxHeight: TILE_SIZE * 2, overflowY: 'auto', bgcolor: '#ff2500' }}>
                        {finishedTeams.map((team, idx) => (
                            <ListItem key={team} sx={{ py: 0 }}>
                                <ListItemText
                                    primary={`${idx + 1}. ${team}`}
                                    primaryTypographyProps={{ fontSize: TEXT_SIZE, color: 'black' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default Board;