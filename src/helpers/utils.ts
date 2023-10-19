export class Utils {
    public static shuffleArray(arr: any[]) {
        for (let i: number = arr.length - 1; i >= 0; i--) {
            let randomIndex: number = Math.floor(Math.random() * (i + 1));
            let itemAtIndex: number = arr[randomIndex];
            arr[randomIndex] = arr[i];
            arr[i] = itemAtIndex;
        }
    }
}