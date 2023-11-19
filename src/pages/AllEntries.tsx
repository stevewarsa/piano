import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../model/AppState";
import {PracticeEntry} from "../model/practice-entry";
import {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import SpinnerTimer from "../components/SpinnerTimer";
import practiceService from "../services/practice-service";
import {stateActions} from "../store";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AgGridReact} from "ag-grid-react";
import {DateUtils} from "../helpers/date.utils";
import {ColDef} from "ag-grid-community";
import {ButtonCellRenderer} from "../renderers/button.cell.renderer";
import {useNavigate} from "react-router-dom";
import {Song} from "../model/song";

const SongListRenderer = props => {
    // Assuming you have a function to get the song names based on the primary keys
    const getSongNames = songIds => {
        const songNames = songIds.map(key => {
            const song = props.songs.find(song => song.songId === key);
            return song ? song.songNm : `Song ${key}`;
        });

        return songNames.join(', ');
    };

    return <div>{getSongNames(props.value)}</div>;
};

const CustomTooltip = ({ value }) => {
    return <div style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{value}</div>;
};

const timeFormat = "EEE MM-dd-yy HH:mm";
const AllEntries = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const practiceEntries: PracticeEntry[] = useSelector((st: AppState) => st.practiceEntries);
    const songs: Song[] = useSelector((st: AppState) => st.songs);
    const [busy, setBusy] = useState({state: false, message: ""});
    const columnDefs: ColDef[] = [
        {
            field: 'startDtTimeLong',
            cellRenderer: ButtonCellRenderer,
            cellRendererParams: {
                showUnderline: true,
                onClick: params => {
                    loadEntry(params.data);
                },
                getLabel: params => {
                    console.log("startDtTimeLong.valueFormatter - params:", params);
                    return params.node.data?.startDtTimeLong ? DateUtils.formatDateTime(new Date(parseInt(params.node.data?.startDtTimeLong)), timeFormat) : "";
                }
            }
        },
        {field: 'duration'},
        {field: 'practiceLocation'},
        {field: 'lessonContent'},
        {
            field: 'songsPracticed',
            headerName: 'Song List',
            cellRenderer: SongListRenderer,
            cellRendererParams: {
                songs: songs
            },
            tooltipComponent: 'customTooltip',
            tooltipValueGetter: (params) => {
                if (!songs || songs.length === 0 || !params.data.songsPracticed || params.data.songsPracticed.length === 0) {
                    return "";
                }
                console.log("tooltipValueGetter - Here are the songs: ", songs);
                console.log("tooltipValueGetter - Here are the songIds: ", params.data.songsPracticed);
                const toolTip = params.data.songsPracticed.map(songId => songs.find(s => s.songId === songId)).map(song => song.songNm);
                console.log("Here is the tooltip value: ", toolTip);
                return toolTip;
            }
        }
    ];

    useEffect(() => {
        setBusy({state: true, message: "Loading practice entries from DB..."});
        practiceService.getPracticeEntries().then(async practiceData => {
            const entries: PracticeEntry[] = practiceData.data;
            dispatch(stateActions.setPracticeEntries(entries));
            const locSongs = await practiceService.getSongs();
            const songResponse: Song[] = locSongs.data;
            songResponse.sort((a, b) => {
                const nameA = a.songNm.toUpperCase();
                const nameB = b.songNm.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            dispatch(stateActions.setSongs(songResponse));
            setBusy({state: false, message: ""});
            console.log("AllEntries.useEffect[] - here are all the practice entries:", practiceData.data);
            console.log("AllEntries.useEffect[] - here are the songs:", locSongs.data);
        });
    }, []);

    const loadEntry = (data: PracticeEntry) => {
        navigate("/addPractice", {state: data});
    }

    if (busy.state) {
        return <SpinnerTimer message={busy.message} />;
    } else if (practiceEntries && practiceEntries.length > 0) {
        return (
            <Container className="mt-3 ag-theme-alpine" style={{height: 400, width: "100%"}}>
                <AgGridReact
                    rowData={practiceEntries}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={5}>
                </AgGridReact>
            </Container>
        );
    } else {
        return <h3>No Practice Sessions Exist Yet...</h3>
    }
}
export default AllEntries;