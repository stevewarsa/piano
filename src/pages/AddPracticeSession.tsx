import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import SpinnerTimer from "../components/SpinnerTimer";
import practiceService from "../services/practice-service";
import {stateActions} from "../store";
import {DateUtils} from "../helpers/date.utils";
import {PracticeEntry} from "../model/practice-entry";

const startTime = new Date().getTime();
const timeFormat = "MM-dd-yyyy HH:mm:ss";

const AddPracticeSession = () => {
    const dispatch = useDispatch();
    const [busy, setBusy] = useState({state: false, message: ""});
    const [practiceStartTime, setPracticeStartTime] = useState<number>(startTime);
    const [practiceStartTimeStr, setPracticeStartTimeStr] = useState<string>(DateUtils.formatDateTime(new Date(startTime), timeFormat));
    const [practiceEndTime, setPracticeEndTime] = useState<number>(undefined);
    const [practiceEndTimeStr, setPracticeEndTimeStr] = useState<string>("N/A");
    const [location, setLocation] = useState<string>("Church");
    const [lessonContent, setLessonContent] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [duration, setDuration] = useState<number>(-1);

    useEffect(() => {
        setPracticeStartTimeStr(DateUtils.formatDateTime(new Date(practiceStartTime), timeFormat));
    }, [practiceStartTime]);

    useEffect(() => {
        console.log("AddPracticeSession.useEffect[practiceEndTime] - practiceEndTime = " + practiceEndTime + ", practiceEndTimeStr = " + practiceEndTimeStr + ", practiceStartTime = " + practiceStartTime + ", practiceStartTimeStr = " + practiceStartTimeStr);
        if (typeof practiceEndTime !== "undefined" && typeof practiceStartTime !== "undefined") {
            console.log("AddPracticeSession.useEffect[practiceEndTime] - setting practiceEndTimeStr")
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
    }, [dispatch]);

    const handleLessonContent = (event: any) => {
        setLessonContent(event.target.value);
    };

    const handleNotes = (event: any) => {
        setNotes(event.target.value);
    };

    const handleSubmit = () => {
        const practiceEntry: PracticeEntry = {
            duration: duration,
            lessonContent: lessonContent,
            notes: notes,
            endDtTimeLong: practiceEndTime,
            practiceLocation: location,
            endDtTimeStr: practiceEndTimeStr,
            startDtTimeLong: practiceStartTime,
            startDtTimeStr: practiceStartTimeStr
        };
        console.log("handleSubmit - Here is the practiceEntry: ", practiceEntry);
    };

    if (busy.state) {
        return <SpinnerTimer message={busy.message} />;
    } else {
        return (
            <Container className="mt-3">
                <h3 className="mb-3">Add Practice Session</h3>
                <Row className="mb-2">
                    <Col lg={4}>
                        <Form.Label htmlFor="startDtTime">Start Time</Form.Label>
                    </Col>
                    <Col lg="4">
                        <Form.Text id="startDtTime" className="me-3">
                            {practiceStartTimeStr}
                        </Form.Text>
                        <Button size="sm" onClick={() => setPracticeStartTime(new Date().getTime())}>Now</Button>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={4}>
                        <Form.Label>Location</Form.Label>
                    </Col>
                    <Col lg="4">
                        <Form.Check
                            inline
                            label="Church"
                            name="location"
                            onChange={() => setLocation("Church")}
                            checked={location === "Church"}
                            type="radio"
                            id="home"
                        />
                        <Form.Check
                            inline
                            label="Home"
                            name="location"
                            onChange={() => setLocation("Home")}
                            checked={location === "Home"}
                            type="radio"
                            id="home"
                        />
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={4}>
                        <Form.Label>Lesson Content</Form.Label>
                    </Col>
                    <Col lg="4">
                        <Form.Control value={lessonContent} placeholder="Lesson Content" onChange={handleLessonContent}>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={4}>
                        <Form.Label>Notes</Form.Label>
                    </Col>
                    <Col lg="4">
                        <Form.Control className="fs-1" as="textarea" rows={5} value={notes} placeholder="Notes" onChange={handleNotes}>
                        </Form.Control>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col lg={4}>
                        <Form.Label htmlFor="endDtTime">End Time</Form.Label>
                    </Col>
                    <Col lg="4">
                        <Form.Text id="endDtTime" className="me-3">
                            {practiceEndTimeStr}
                        </Form.Text>
                        <Button size="sm" onClick={() => setPracticeEndTime(new Date().getTime())}>Now</Button>
                    </Col>
                </Row>
                {duration > -1 &&
                <Row className="mb-2">
                    <Col lg={4}>
                        <Form.Label htmlFor="duration">Duration</Form.Label>
                    </Col>
                    <Col lg="4">
                        <Form.Text id="duration">
                            {duration} minutes
                        </Form.Text>
                    </Col>
                </Row>
                }
                <Row className="mb-2">
                    <Col lg={8}>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default AddPracticeSession;