import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import SpinnerTimer from "../components/SpinnerTimer";
import practiceService from "../services/practice-service";
import {stateActions} from "../store";
import {DateUtils} from "../helpers/date.utils";
import {PracticeEntry} from "../model/practice-entry";

const startTime = new Date().getTime();
const timeFormat = "MM-dd-yyyy HH:mm:ss";
const editedTimeFormat = "M/d/yy H:mm";

const AddPracticeSession = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [busy, setBusy] = useState({state: false, message: ""});
    const [practiceStartTime, setPracticeStartTime] = useState<number>(startTime);
    const [practiceStartTimeStr, setPracticeStartTimeStr] = useState<string>(DateUtils.formatDateTime(new Date(startTime), timeFormat));
    const [practiceEndTime, setPracticeEndTime] = useState<number>(undefined);
    const [practiceEndTimeStr, setPracticeEndTimeStr] = useState<string>("N/A");
    const [practiceLocation, setPracticeLocation] = useState<string>("Church");
    const [lessonContent, setLessonContent] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [duration, setDuration] = useState<number>(-1);
    const [show, setShow] = useState<boolean>(false);
    const [editingStartDateTime, setEditingStartDateTime] = useState<boolean>(false);
    const [editedDateString, setEditedDateString] = useState<string>("");
    const [showReason, setShowReason] = useState<boolean>(false);
    const [noPracticeReason, setNoPracticeReason] = useState<string>("");
    let location = useLocation();

    useEffect(() => {
        const formattedDate = DateUtils.formatDateTime(new Date(practiceStartTime), timeFormat);
        const formattedDateForEditing = DateUtils.formatDateTime(new Date(practiceStartTime), editedTimeFormat);
        setPracticeStartTimeStr(formattedDate);
        setEditedDateString(formattedDateForEditing);
    }, [practiceStartTime]);

    useEffect(() => {
        console.log("AddPracticeSession.useEffect[practiceEndTime] - practiceEndTime = " + practiceEndTime + ", practiceEndTimeStr = " + practiceEndTimeStr + ", practiceStartTime = " + practiceStartTime + ", practiceStartTimeStr = " + practiceStartTimeStr);
        if (typeof practiceEndTime !== "undefined" && typeof practiceStartTime !== "undefined") {
            console.log("AddPracticeSession.useEffect[practiceEndTime] - setting practiceEndTimeStr to " + DateUtils.formatDateTime(new Date(practiceEndTime), timeFormat));
            setPracticeEndTimeStr(DateUtils.formatDateTime(new Date(practiceEndTime), timeFormat));
            setDuration(DateUtils.minutesInBetween(new Date(practiceEndTime), new Date(practiceStartTime)));
        }
    }, [practiceEndTime]);

    useEffect(() => {
        setBusy({state: true, message: "Loading practice entries from DB..."});
        practiceService.getPracticeEntries().then(practiceData => {
            dispatch(stateActions.setPracticeEntries(practiceData.data));
            setBusy({state: false, message: ""});
        });
        if (location?.state?.hasOwnProperty("startDtTimeLong")) {
            const practiceEntryToEdit: PracticeEntry = location.state as PracticeEntry;
            console.log("AddPracticeSession.useEffect[dispatch] - practiceEntryToEdit: ", practiceEntryToEdit);
            setPracticeStartTime(parseInt(String(practiceEntryToEdit.startDtTimeLong)));
            setPracticeStartTimeStr(practiceEntryToEdit.startDtTimeStr);
            setPracticeLocation(practiceEntryToEdit.practiceLocation);
            setNotes(practiceEntryToEdit.notes);
            setLessonContent(practiceEntryToEdit.lessonContent);
            setPracticeEndTime(parseInt(String(practiceEntryToEdit.endDtTimeLong)));
            setPracticeEndTimeStr(practiceEntryToEdit.endDtTimeStr);
            setDuration(parseInt(String(practiceEntryToEdit.duration)));
        }
    }, [dispatch]);

    const handleLessonContent = (event: any) => {
        setLessonContent(event.target.value);
    };

    const handleNotes = (event: any) => {
        setNotes(event.target.value);
    };

    const handleClose = () => {
        console.log("handleClose");
        setShow(false);
    };

    const handleSaveDate = () => {
        console.log("handleSaveDate");
        const dt = DateUtils.parseDate(editedDateString, editedTimeFormat);
        if (editingStartDateTime) {
            setPracticeStartTime(dt.getTime());
        } else {
            setPracticeEndTime(dt.getTime());
        }
        setShow(false);
    };

    const handleSubmit = async () => {
        setBusy({state: true, message: "Saving current practice entry..."});
        const practiceEntry: PracticeEntry = {
            duration: duration,
            lessonContent: lessonContent,
            notes: notes,
            endDtTimeLong: practiceEndTime,
            practiceLocation: practiceLocation,
            endDtTimeStr: practiceEndTimeStr,
            startDtTimeLong: practiceStartTime,
            startDtTimeStr: practiceStartTimeStr
        };
        console.log("handleSubmit - Here is the practiceEntry: ", practiceEntry);
        const saveEntryResult: any = await practiceService.savePracticeEntry(practiceEntry);
        console.log("AddPracticeSession.handleSubmit - here is the response:");
        console.log(saveEntryResult.data);
        if (typeof saveEntryResult.data === "string" && saveEntryResult.data.startsWith("error")) {
            console.log("There was an error: " + saveEntryResult.data)
        } else {
            dispatch(stateActions.addPracticeEntry(saveEntryResult.data));
            setBusy({state: false, message: ""});
            navigate("/allEntries");
        }
    };

    const handleNoPractice = async () => {
        setBusy({state: true, message: "Saving 'no practice'..."});
        const practiceEntry: PracticeEntry = {
            duration: 0,
            lessonContent: noPracticeReason,
            notes: noPracticeReason,
            endDtTimeLong: practiceStartTime,
            practiceLocation: "None",
            endDtTimeStr: practiceStartTimeStr,
            startDtTimeLong: practiceStartTime,
            startDtTimeStr: practiceStartTimeStr
        };
        console.log("handleSubmit - Here is the practiceEntry: ", practiceEntry);
        const saveEntryResult: any = await practiceService.savePracticeEntry(practiceEntry);
        console.log("AddPracticeSession.handleSubmit - here is the response:");
        console.log(saveEntryResult.data);
        if (typeof saveEntryResult.data === "string" && saveEntryResult.data.startsWith("error")) {
            console.log("There was an error: " + saveEntryResult.data)
        } else {
            dispatch(stateActions.addPracticeEntry(saveEntryResult.data));
            setBusy({state: false, message: ""});
            navigate("/allEntries");
        }

    };

    if (busy.state) {
        return <SpinnerTimer message={busy.message} />;
    } else {
        return (
            <Container className="mt-3">
                <h3 className="mb-3">Add Practice Session</h3>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {editingStartDateTime ? "Start" : "End"} Date</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter Date/Time ({timeFormat})</Form.Label>
                                <Form.Control
                                    value={editedDateString}
                                    type="string"
                                    placeholder={timeFormat}
                                    onChange={evt => setEditedDateString(evt.target.value)}
                                    autoFocus
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveDate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showReason} onHide={() => setShowReason(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>No Practice Reason</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>No Practice Reason</Form.Label>
                                <Form.Control
                                    value={noPracticeReason}
                                    type="string"
                                    placeholder="Enter No Practice Reason"
                                    onChange={evt => setNoPracticeReason(evt.target.value)}
                                    autoFocus
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReason(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleNoPractice}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label htmlFor="startDtTime">Start Time</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Text id="startDtTime" className="me-3">
                            {practiceStartTimeStr}
                        </Form.Text>
                        <Button className="me-3" size="sm" onClick={() => setPracticeStartTime(new Date().getTime())}>Now</Button>
                        <Button className="me-3" size="sm" onClick={() => {
                            setEditingStartDateTime(true);
                            setShow(true);
                        }}>Enter Exact</Button>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label>Location</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Check
                            inline
                            label="Church"
                            name="location"
                            onChange={() => setPracticeLocation("Church")}
                            checked={practiceLocation === "Church"}
                            type="radio"
                            id="home"
                        />
                        <Form.Check
                            inline
                            label="Home"
                            name="location"
                            onChange={() => setPracticeLocation("Home")}
                            checked={practiceLocation === "Home"}
                            type="radio"
                            id="home"
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label>Lesson Content</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control value={lessonContent} placeholder="Lesson Content" onChange={handleLessonContent}>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label>Notes</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control className="fs-1" as="textarea" rows={5} value={notes} placeholder="Notes" onChange={handleNotes}>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label htmlFor="endDtTime">End Time</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Text id="endDtTime" className="me-3">
                            {practiceEndTimeStr}
                        </Form.Text>
                        <Button className="me-3" size="sm" onClick={() => setPracticeEndTime(new Date().getTime())}>Now</Button>
                        <Button className="me-3" size="sm" onClick={() => {
                            setEditingStartDateTime(false);
                            setShow(true);
                        }}>Enter Exact</Button>
                    </Col>
                </Row>
                {duration > -1 &&
                <Row className="mb-2">
                    <Col lg={2}>
                        <Form.Label htmlFor="duration">Duration</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Text id="duration">
                            {duration} minutes
                        </Form.Text>
                    </Col>
                </Row>
                }
                <Row className="mb-2">
                    <Col lg={6}>
                        <Button className="me-3" onClick={handleSubmit}>Submit</Button>
                        <Button onClick={() => setShowReason(true)}>No Practice Today</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default AddPracticeSession;