import {Button, Col, Row} from "react-bootstrap";

const NextPrevNavigationComponent = (props: { onClick: () => void, currEntryIndex: number, onClick1: () => void }) => {
    return <Row className="mb-2 text-center">
        <Col className="text-center d-flex align-items-center">
            <Button className="me-3" variant={"outline-primary"} size="lg"
                    onClick={props.onClick}>
                <i className="fa fa-arrow-left"/>
            </Button>
            <span className="fw-bold fs-1 me-3">{props.currEntryIndex + 1}</span>
            <Button variant={"outline-primary"} size="lg" onClick={props.onClick1}>
                <i className="fa fa-arrow-right"/>
            </Button>
        </Col>
    </Row>;
};

export default NextPrevNavigationComponent;