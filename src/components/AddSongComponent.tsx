import {Button, Form, Modal} from "react-bootstrap";

const AddSongComponent = (props: {
    show: boolean,
    onHide: () => void,
    value: string,
    onChange: (evt) => void,
    onClick: () => void,
    onClick1: () => Promise<void>
}) => {
    return <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Add Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Enter Song Name</Form.Label>
                    <Form.Control
                        value={props.value}
                        type="string"
                        placeholder="Enter a New Song Name"
                        onChange={props.onChange}
                        autoFocus
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onClick}>
                Close
            </Button>
            <Button variant="primary" onClick={props.onClick1}>
                Save Song
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default AddSongComponent;