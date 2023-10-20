import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../model/AppState";
import {PracticeEntry} from "../model/practice-entry";
import {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import SpinnerTimer from "../components/SpinnerTimer";
import practiceService from "../services/practice-service";
import {stateActions} from "../store";

const AllEntries = () => {
    const dispatch = useDispatch();
    const practiceEntries: PracticeEntry[] = useSelector((st: AppState) => st.practiceEntries);
    const [busy, setBusy] = useState({state: false, message: ""});
    const [page, setPage] = useState(1);
    const [pageLen, setPageLen] = useState(1);
    const [currPageEntries, setCurrPageEntries] = useState<PracticeEntry[]>([]);

    useEffect(() => {
        setBusy({state: true, message: "Loading practice entries from DB..."});
        practiceService.getPracticeEntries().then(practiceData => {
            dispatch(stateActions.setPracticeEntries(practiceData.data));
            setBusy({state: false, message: ""});
        });
    }, [dispatch]);
    const handleFirstPage = () => {
        setPage(1);
    };

    const handleNextPage = () => {
        console.log("handleNextPage - page=" + page + ", pageLen=" + pageLen);
        if (page === pageLen) {
            return;
        }
        setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (page === 1) {
            return;
        }
        setPage(prev => prev - 1);
    };

    const handleLastPage = () => {
        setPage(pageLen);
    };
    if (busy.state) {
        return <SpinnerTimer message={busy.message} />;
    } else {
        if (currPageEntries && currPageEntries.length > 0) {
            return (
                <Container className="mt-3"></Container>
            );
        } else {
            return <h3>No Practice Sessions Exist Yet...</h3>
        }
    }
}
export default AllEntries;