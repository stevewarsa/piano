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

const timeFormat = "EEE MM-dd-yy HH:mm";
const AllEntries = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const practiceEntries: PracticeEntry[] = useSelector((st: AppState) => st.practiceEntries);
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
        {field: 'lessonContent'}
    ];

    useEffect(() => {
        setBusy({state: true, message: "Loading practice entries from DB..."});
        practiceService.getPracticeEntries().then(practiceData => {
            dispatch(stateActions.setPracticeEntries(practiceData.data));
            setBusy({state: false, message: ""});
            console.log("AllEntries.useEffect[] - here are all the practice entries:", practiceData.data);
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