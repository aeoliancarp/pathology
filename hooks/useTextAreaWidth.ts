import { useContext } from 'react';
import { PageContext } from '../contexts/pageContext';

export default function useTextAreaWidth() {
  const { windowSize } = useContext(PageContext);
  // magic number to account for modal padding and margin
  const maxTextAreaWidth = windowSize.width - 82;

  return maxTextAreaWidth < 500 ? maxTextAreaWidth : 500;
}
