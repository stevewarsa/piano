import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import axiosRetry from "axios-retry";
import {PracticeEntry} from "../model/practice-entry";

class PracticeService {
    public getPracticeEntries() {
        return PracticeService.buildAxios().get<any[]>("/piano-app/server/get_practice_entries.php");
    }

    public savePracticeEntry(entry: PracticeEntry) {
        return PracticeService.buildAxios().post("/piano-app/server/add_practice_entry.php", entry);
    }

    public saveNewSong(songName: string) {
        return PracticeService.buildAxios().post("/piano-app/server/add_song.php", songName);
    }

    public getSongs() {
        return PracticeService.buildAxios().get("/piano-app/server/get_songs.php")
    }

    private static buildAxios(): AxiosInstance {
        // implement 15 second timeout
        const config: AxiosRequestConfig = {
            timeout: 12000
        } as AxiosRequestConfig;
        let axiosInstance = axios.create(config);
        axiosRetry(axiosInstance, {
            retries: 3,
            shouldResetTimeout: true,
            retryCondition: (_error) => true // retry no matter what
        });
        return axiosInstance;
    }
}
export default new PracticeService();
