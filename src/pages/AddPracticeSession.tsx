import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import SpinnerTimer from "../components/SpinnerTimer";
import practiceService from "../services/practice-service";
import {stateActions} from "../store";
import {DateUtils} from "../helpers/date.utils";

const AddPracticeSession = () => {
    const dispatch = useDispatch();
    const [busy, setBusy] = useState({state: false, message: ""});
    const [practiceStartTime, setPracticeStartTime] = useState<string>(DateUtils.formatDateTime(new Date(), "MM-dd-yyyy HH:mm"));

    useEffect(() => {
        setBusy({state: true, message: "Loading practice entries from DB..."});
        practiceService.getPracticeEntries().then(practiceData => {
            dispatch(stateActions.setPracticeEntries(practiceData.data));
            setBusy({state: false, message: ""});
        });
    }, [dispatch]);

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
                        <Form.Text id="startDtTime">
                            {practiceStartTime}
                        </Form.Text>
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
                            checked={true}
                            type="radio"
                            id="home"
                        />
                        <Form.Check
                            inline
                            label="Home"
                            checked={false}
                            type="radio"
                            id="home"
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}
export default AddPracticeSession;