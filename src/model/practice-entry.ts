export interface PracticeEntry {
    startDtTimeLong: number;
    startDtTimeStr: string;
    endDtTimeLong: number;
    endDtTimeStr: string;
    duration: number;
    practiceLocation: string;
    lessonContent: string;
    notes: string;
    songsPracticed: number[];
}