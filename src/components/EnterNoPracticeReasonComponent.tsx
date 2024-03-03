import {Button, Form, Modal} from "react-bootstrap";

const EnterNoPracticeReasonComponent = (props: {
    show: boolean,
    onHide: () => void,
    value: string,
    onChange: (evt) => void,
    onClick: () => Promise<void>
}) => {
    return <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>No Practice Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>No Practice Reason</Form.Label>
                    <Form.Control
                        value={props.value}
                        type="string"
                        placeholder="Enter No Practice Reason"
                        onChange={props.onChange}
                        autoFocus
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>
            <Button variant="primary" onClick={props.onClick}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>;
};
export default EnterNoPracticeReasonComponent;