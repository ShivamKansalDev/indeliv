import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import './InformationModal.css'

interface User{
  id: number;
  image: string;
  name: string;
  mobile: string;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
}

const InformationModal = (props: any) => {
    const {
        informationOpen = false,
        setInformationOpen = () => {},
        handleSelect,
        selectedOption
    } = props;
    const user: User = props.selectedUser;
  return (
    <Modal show={informationOpen} centered dialogClassName="modal-90w" className="information-modal"
    onHide={()=> {
        setInformationOpen(!informationOpen)
    }}
    >
      <div className="p-3" >
        <p className="mb-0 ms-2">Employee's Information</p>
        <hr />
        <div className="container">
            <div className="flex d-flex">
                <div className="me-3">
                    <img src="/assets/image/user.png" alt="Rajat" className=""/>
                </div>
                <div className="d-flex flex-column justify-content-center">
                    <p className="text-primary mb-0" style={{fontWeight:"600"}}>Upload Your Profile</p>
                    <p className="text-secondary" style={{fontSize: "0.8rem"}}>Max. 800x400px</p>
                </div>
            </div>
            <div className="mt-2">
                <Form.Label>Role <span className="imp">*</span></Form.Label>

                <Dropdown 
                  onSelect={handleSelect} 
                >
                    <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic"
                        className="custom-dropdown-toggle res"
                    >
                        {selectedOption}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu">
                        <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
                        <Dropdown.Item eventKey="Manager">Manager</Dropdown.Item>
                        <Dropdown.Item eventKey="Delivery Associates">Delivery Associates</Dropdown.Item>
                        <Dropdown.Item eventKey="Sales Associates">Sales Associates</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="flex d-flex justify-content-between">
                <div>
                <Form.Label>First Name <span className="imp">*</span></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    autoFocus
                />
                </div>
                <div>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        autoFocus
                    />
                </div>
            </div>
            <div className="flex d-flex justify-content-between my-3">
                <div>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email address"
                        autoFocus
                    />
                </div>
                <div>
                    <Form.Label>Phone Number <span className="imp">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="9265821****"
                        autoFocus
                    />
                </div>
            </div>
            <Form.Label>Set Password <span className="imp">*</span></Form.Label>
            <Form.Control
                type="password"
                placeholder="********"
                autoFocus
            />


            <div className="d-flex justify-content-end mt-3">
                <Button className="me-2" variant="light" onClick={()=>{setInformationOpen(false)}}>
                    Cancel
                </Button>
                <Button variant="primary">Apply Changes</Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default InformationModal;