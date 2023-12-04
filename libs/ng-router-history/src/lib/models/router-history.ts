import { NavigationEnd, NavigationStart } from '@angular/router';

import { HistoryEntry } from './history-entry';
import { NavigationTrigger } from './navigation-trigger';

export interface RouterHistory {
  history: HistoryEntry[];
  currentIndex: number;
  event: NavigationStart | NavigationEnd | undefined;
  trigger: NavigationTrigger | undefined;
  id: number;
  restoredId: number | undefined;
  direction: number;
}
