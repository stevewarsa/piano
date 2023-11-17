import {PracticeEntry} from "./practice-entry";
import {Song} from "./song";

export interface AppState {
    practiceEntries: PracticeEntry[];
	songs: Song[];
}