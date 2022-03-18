import React, { useContext } from 'react';
import Block from './block';
import Control from '../../models/control';
import Controls from './controls';
import Dimensions from '../../constants/dimensions';
import { GameState } from './game';
import Grid from './grid';
import Level from '../../models/data/pathology/level';
import Player from './player';
import { WindowSizeContext } from '../windowSizeContext';

interface GameLayoutProps {
  controls: Control[] | undefined;
  gameState: GameState;
  level: Level;
}

export default function GameLayout({ controls, gameState, level }: GameLayoutProps) {
  const windowSize = useContext(WindowSizeContext);

  // use the default control size or shrink to fit the screen
  const fitControlWidth = !controls ? 0 :
    Math.floor(windowSize.width / controls.length);
  const controlWidth = !controls ? 0 :
    Dimensions.ControlSize < fitControlWidth ? Dimensions.ControlSize : fitControlWidth;
  const controlHeight = controlWidth * 0.7;

  // calculate the square size based on the available game space and the level dimensions
  // NB: forcing the square size to be an integer allows the block animations to travel along actual pixels
  const maxGameHeight = windowSize.height - controlHeight;
  const maxGameWidth = windowSize.width;
  const squareSize = level.width / level.height > maxGameWidth / maxGameHeight ?
    Math.floor(maxGameWidth / level.width) : Math.floor(maxGameHeight / level.height);
  const squareMargin = Math.round(squareSize / 40);

  return (<>
    <div style={{
      left: (maxGameWidth - squareSize * level.width) / 2,
      position: 'absolute',
      top: (maxGameHeight - squareSize * level.height) / 2,
    }}>
      {gameState.blocks.map(block => <Block
        block={block}
        borderWidth={squareMargin}
        key={block.id}
        size={squareSize}
      />)}
      <Player
        borderWidth={squareMargin}
        gameState={gameState}
        leastMoves={level.leastMoves}
        size={squareSize}
      />
      <Grid
        board={gameState.board}
        borderWidth={squareMargin}
        level={level}
        squareSize={squareSize}
      />
    </div>
    {!controls ? null :
      <Controls
        controls={controls}
        controlHeight={controlHeight}
        controlWidth={controlWidth}
      />
    }
  </>);
}
