import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import axiosRetry from "axios-retry";

class PracticeService {
    public getPracticeEntries() {
        return PracticeService.buildAxios().get<any[]>("/piano-app/server/get_practice_entries.php");
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