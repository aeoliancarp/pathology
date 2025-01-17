import GraphType from '../../constants/graphType';
import Collection from './collection';
import User from './user';

interface Graph {
  source: User;
  sourceModel: string;
  target: User | Collection;
  targetModel: string;
  type: GraphType;
}

export default Graph;
