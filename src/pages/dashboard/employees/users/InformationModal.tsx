import { useRef, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";

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
    const initialProfilePicture: string = "/assets/image/user.png";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [passwordToggle, setPasswordToggle] = useState(false);
    const [pic, setPic] = useState<string>(initialProfilePicture)
    const handleImageClick = () => {
        fileInputRef!.current!.click();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file);
            setPic(URL.createObjectURL(file));
        }
    };

    const handleCloseModal = () => {
        setInformationOpen(false);
        setPasswordToggle(false);
        setPic(initialProfilePicture);
    }

  return (
    <Modal show={informationOpen} centered dialogClassName="modal-90w" className="information-modal"

    >
      <div className="p-3" >
        <div className="modal-header mx-2 px-0 pt-0 pb-2 mb-2">
            <p className="mb-0 fw-semibold mx-0">Employees Information</p>
        </div>
        <div className="container">
            <div className="flex d-flex">
                <div className="me-3">
                    <img
                        src={pic}
                        className="profile"
                        alt="Upload"
                        onClick={handleImageClick}
                    />
                </div>
                <div className="d-flex flex-column pt-2" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                    <p className="text-primary mb-0" style={{fontWeight:"600"}}>Upload Your Profile</p>
                    <p className="text-secondary" style={{fontSize: "0.8rem"}}>Max. 800x400px</p>
                </div>
                <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                </Form.Group>

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
            <div className="flex d-flex justify-content-between mt-3">
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
            <div className="flex d-flex">
                <Form.Control
                    type={passwordToggle ? "text" : "password"}
                    placeholder="********"
                    autoFocus
                />
                <img
                src={`/assets/Icon/Eye ${passwordToggle ?  'Show' : 'Off'} Pass.svg`}
                onClick={()=>{setPasswordToggle(!passwordToggle)}} className="eye"/>
            </div>

            <div className="d-flex justify-content-end mt-3 modal-footer pb-0 pe-0">
                <Button className="me-2 fw-semibold lh-1" variant="light" onClick={()=>{ handleCloseModal() }}>
                    Cancel
                </Button>
                <Button variant="primary fs-6 lh-sm">Apply Changes</Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default InformationModal;