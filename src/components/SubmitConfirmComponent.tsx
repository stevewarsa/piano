import {Button, Modal} from "react-bootstrap";

const SubmitConfirmComponent = (props: {
    show: boolean,
    onHide: () => void,
    strings: string[],
    callbackfn: (r) => JSX.Element,
    onClick: () => Promise<void>,
    onClick1: () => void
}) => {
    return <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Submit?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ol>
                {props.strings.map(props.callbackfn)}
            </ol>
            The above validation errors have been found. Would you like to continue?
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={props.onClick}>Yes</Button>
            <Button variant="secondary" onClick={props.onClick1}>No</Button>
        </Modal.Footer>
    </Modal>;
};

export default SubmitConfirmComponent;