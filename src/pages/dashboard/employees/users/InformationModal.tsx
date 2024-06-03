import { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { User, UserDetails, UserRole } from "./UserBody";
import './InformationModal.css'

const InformationModal = (props: any) => {
    const {
        informationOpen = false,
        setInformationOpen = () => {},
        handleSelect,
        selectedOption,
        setUserDetails = () => {},
        createUpdateUserAPI = () => {}
    } = props;
    const user: User = props.selectedUser;
    const userRoles: UserRole[] = props.userRoles;
    const userDetails: UserDetails = props.userDetails; 
    const initialProfilePicture: string = "/assets/Icon/User.svg";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [passwordToggle, setPasswordToggle] = useState(false);
    const [selectRole, setSelectRole] = useState<string>();
    const [pic, setPic] = useState<string>(initialProfilePicture);
    const [emptyFields, setEmptyFields] = useState<string[]>([]);
    const [selectedUserRole, setSelectedUserRole] = useState<UserRole[]>([]);

    function rearrangeUserRoles() {
        console.log("^^^^^^^ findUserIndex: ", userRoles);
        const findUserIndex = userRoles.findIndex((item) => {
          return (item.name === selectRole);    
        });
        if(findUserIndex > -1){
          const newData = Array.from(userRoles)
          const initialIndexData = newData[0];
          newData[0] = newData[findUserIndex];
          newData[findUserIndex] = initialIndexData;
          setSelectedUserRole(newData);
        }
      }

    const handleImageClick = () => {
        fileInputRef!.current!.click();
        
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Selected file:", file);
            setUserDetails({
                ...userDetails,
                image: URL.createObjectURL(file)
            })
        }
    };

    const handleCloseModal = () => {
        setInformationOpen(false);
        setPasswordToggle(false);
    }

    useEffect(() => {
        if(informationOpen && user){
            const findRole = userRoles.find((item) => item.id === user.role_id);
            if(findRole){
                setSelectRole(findRole.name);
            }
        }
    }, [informationOpen])

    useEffect(() => {
        if(userDetails?.role_id){
            const findRole = userRoles.find((item) => item.id === userDetails.role_id);
            if(findRole){
                setSelectRole(findRole.name);
            }
        }
    }, [userDetails])

    useEffect(() => {
        const keyItems: string[] = Object.keys(userDetails).filter((item) => {
            if(item === "last_name"){
                return false;
            }else if(user && (item === "email")){
                return false;
            }else if((item === "emailError")){
                return false;
            }else if(user && (item === "password")){
                return false;
            }
            return true
        });
        const filterEmpty = keyItems.filter((item) => {
            const details: any = Object.assign({}, userDetails)
            if((typeof details[item] === "number") && (item === "role_id")){
                return false;
            }else if((details[item] && (item === "email") && !userDetails?.emailError)){
                return false
            }else if (details[item] && (item !== "emailError") && (item !== "email")){
                return false;
            }
            return true
        })
        console.log("@@@ FIND EMPTY: ", filterEmpty);
        setEmptyFields(filterEmpty);
    }, [userDetails]);

  return (
    <Modal show={informationOpen} centered dialogClassName="modal-90w" className="information-modal">
      <div className="p-3" >
        <div className="modal-header mx-2 px-0 pt-0 pb-2 mb-2">
            <p className="mb-0 fw-semibold mx-0">{(user)? "Employees Information" : "Add Employee"}</p>
        </div>
        <div className="container">
            <div className="flex d-flex">
                <div className="me-3">
                    <img
                        src={userDetails?.image || pic}
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
                        className="custom-dropdown-toggle res "
                       
                    >
                        {selectRole || "Select role"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="custom-dropdown-menu">
                        {(selectRole) && (
                            <Dropdown.Item key={'selectRole1'} className={"bgClass"} eventKey={selectRole}>{selectRole}</Dropdown.Item>
                        )}
                        {userRoles.map((role) => {
                            if(role.name === selectRole){
                                return null;
                            }
                            return (
                                <Dropdown.Item key={`role${role.id}`} eventKey={role.name}>{role.name}</Dropdown.Item>
                            )
                        })}
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
                    value={userDetails?.first_name}
                    onChange={(e) => {
                        const regex = /[^A-Za-z0-9,' ']/g;
                        setUserDetails({
                            ...userDetails,
                            first_name: e.target.value.replace(regex, '')
                        });
                    }}
                />
                </div>
                <div>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        autoFocus
                        value={userDetails?.last_name}
                        onChange={(e) => {
                            const regex = /[^A-Za-z0-9,' ']/g;
                            setUserDetails({
                                ...userDetails,
                                last_name: e.target.value.replace(regex, '')
                            });
                        }}
                    />
                </div>
            </div>
            <div className="flex d-flex justify-content-between my-3">
                <div>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        autoFocus
                        disabled={user? true : false}
                        value={user?.email || userDetails?.email}
                        onChange={(e) => {
                            const text = e.target.value;
                            const check = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(check.test(String(text).toLowerCase())){
                                setUserDetails({
                                    ...userDetails,
                                    email: text,
                                    emailError: false
                                })
                            }else{
                                setUserDetails({
                                    ...userDetails,
                                    email: text,
                                    emailError: true
                                })
                            }
                        }}
                    />
                </div>
                <div>
                    <Form.Label>Phone Number <span className="imp">*</span></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Phone"
                        autoFocus
                        maxLength={10}
                        value={userDetails.phone}
                        onChange={(e) => {
                            const regex = /[^0-9]/g;
                            setUserDetails({
                                ...userDetails,
                                phone: e.target.value.replace(regex, '')
                            });
                        }}
                    />
                </div>
            </div>
            <Form.Label>Set Password <span className="imp">{(user)? "" : "*"}</span></Form.Label>
            <div className="flex d-flex">
                <Form.Control
                    type={passwordToggle ? "text" : "password"}
                    placeholder="Password"
                    autoFocus
                    value={userDetails.password}
                    onChange={(e) => setUserDetails({
                        ...userDetails,
                        password: e.target.value
                    })}
                />
                {/* <img
                src={`/assets/Icon/Eye ${passwordToggle ?  'Show' : 'Off'} Pass.svg`}
                onClick={()=>{setPasswordToggle(!passwordToggle)}} className="eye"/> */}
            </div>

            <div className="d-flex justify-content-end mt-3 modal-footer pb-0 pe-0">
                <Button className="me-2 fw-semibold lh-1" variant="light" onClick={()=>{ handleCloseModal() }}>
                    Cancel
                </Button>
                <Button variant="primary fs-6 lh-sm"
                    onClick={() => {
                        if(emptyFields?.length > 0){
                            let message = "";
                            emptyFields.forEach((item, index) => {
                                message += `${index + 1}. ${item.replace(/^\w/, (c) => c.toUpperCase())} is required.\n`
                            })
                            alert(message);
                        }else{
                            createUpdateUserAPI();
                        }
                    }}
                >
                    {(user)? "Apply Changes" : "Add"}
                </Button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default InformationModal;