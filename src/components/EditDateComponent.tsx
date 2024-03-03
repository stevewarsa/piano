import {Button, Form, Modal} from "react-bootstrap";
import {timeFormat} from "../model/format-constants";

const EditDateComponent = (props: {
    show: boolean,
    onHide: () => void,
    editingStartDateTime: boolean,
    value: string,
    onChange: (evt) => void,
    onClick: () => void
}) => {
    return <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Edit {props.editingStartDateTime ? "Start" : "End"} Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Enter Date/Time ({timeFormat})</Form.Label>
                    <Form.Control
                        value={props.value}
                        type="string"
                        placeholder={timeFormat}
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
export default EditDateComponent;