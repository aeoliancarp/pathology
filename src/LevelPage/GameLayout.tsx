import React, { useContext } from 'react';
import { WindowSizeContext } from '../Common/WindowSizeContext';
import Color from '../Constants/Color';
import Dimensions from '../Constants/Dimensions';
import LevelDataType from '../Constants/LevelDataType';
import Level from '../DataModels/Pathology/Level';
import Control from '../Models/Control';
import Block from './Block';
import Controls from './Controls';
import { GameState } from './Game';
import Grid from './Grid';

interface GameLayoutProps {
  controls: Control[];
  gameState: GameState;
  level: Level;
  top: number;
}

export default function GameLayout({ controls, gameState, level, top }: GameLayoutProps) {
  const windowSize = useContext(WindowSizeContext);

  // use the default control size or shrink to fit the screen
  const fitControlSize = Math.floor(windowSize.width / controls.length);
  const controlSize = Dimensions.ControlSize < fitControlSize ? Dimensions.ControlSize : fitControlSize;

  // calculate the square size based on the available game space and the level dimensions
  // NB: forcing the square size to be an integer allows the block animations to travel along actual pixels
  const maxGameHeight = windowSize.height - top - controlSize;
  const maxGameWidth = windowSize.width;
  const squareSize = level.width / level.height > maxGameWidth / maxGameHeight ?
    Math.floor(maxGameWidth / level.width) : Math.floor(maxGameHeight / level.height);

  // calculate the final game position and size
  const gameHeight = squareSize * level.height;
  const gameWidth = squareSize * level.width;
  const gameTop = (maxGameHeight - gameHeight) / 2 + top;
  const gameLeft = (maxGameWidth - gameWidth) / 2;

  return (<>
    <div style={{
      height: gameHeight,
      left: gameLeft,
      position: 'fixed',
      top: gameTop,
      width: gameWidth,
    }}>
      <Block
        color={Color.Player}
        position={gameState.pos}
        size={squareSize}
        text={gameState.endText === undefined ? String(gameState.moveCount) : gameState.endText}
        textColor={
          gameState.moveCount > level.leastMoves ? Color.TextEndLose :
          gameState.endText === undefined ? Color.TextMove :
          gameState.moveCount < level.leastMoves ? Color.TextEndRecord : Color.TextEndWin}
        type={LevelDataType.Default}
      />
      {gameState.blocks.map(block => <Block
        color={Color.Block}
        key={block.id}
        position={block.pos}
        size={squareSize}
        type={block.type}
      />)}
      <Grid
        board={gameState.board}
        level={level}
        squareSize={squareSize}
      />
    </div>
    <Controls
      controls={controls}
      controlSize={controlSize}
    />
  </>);
}