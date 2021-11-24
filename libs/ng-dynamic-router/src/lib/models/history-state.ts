import {NavigationDirection} from './navigation-direction';
import {ParentRoute} from './parent-route';

export interface HistoryState {
  url: string;
  timestamp: number;
  parents: ParentRoute[];
  direction?: NavigationDirection | null;
  replaced: boolean;
}


