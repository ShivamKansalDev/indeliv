import { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import countryList from "react-select-country-list";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import { User, UserDetails, UserRole } from "./UserBody";

import './InformationModal.css';
import '../modal_style.css';
import { TOKEN_STORAGE } from "@/utils/constants";
import { useGetUserMutation } from "@/state/slices/authApiSlice";

interface CountryOption {
    label: string;
    value: string;
    code: string;
}

interface LoggedInUser {
    id?: number;
    name?: string;
    email?: string;
    role_id?: number;
    role_name?: string;
    isLogin?: boolean;
  }

const InformationModal = (props: any) => {
    const {
        informationOpen = false,
        setInformationOpen = () => {},
        handleSelect,
        selectedOption,
        setUserDetails = () => {},
        createUpdateUserAPI = () => {},
        setCropOpen = () => {},
        disableInfoModalButton = false
    } = props;
    const [getUser, { data, isSuccess }] = useGetUserMutation();
    const authToken = localStorage.getItem(TOKEN_STORAGE);
    const user: User = props.selectedUser;
    const cropOpen: boolean = props.cropOpen;
    const userRoles: UserRole[] = props.userRoles;
    const userDetails: UserDetails = props.userDetails; 
    const initialProfilePicture: string = "/assets/Icon/User.svg";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [passwordToggle, setPasswordToggle] = useState(false);
    const [selectRole, setSelectRole] = useState<string>();
    const [pic, setPic] = useState<string>(initialProfilePicture);
    const [emptyFields, setEmptyFields] = useState<string[]>([]);
    const [selectedUserRole, setSelectedUserRole] = useState<UserRole[]>([]);
    const [countryNamesList, setCountryNamesList] = useState<any[] | []>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("IN");
    const [loginUserData, setLoginUserData] = useState<LoggedInUser>({});

    useEffect(() => {
        if (Boolean(authToken) && !Boolean(loginUserData?.role_name)) {
          getUser();
        }
      }, [authToken])
    
      useEffect(() => {
        if (data && isSuccess) {
            // console.log("@@@ LOGGED IN USER: ", data?.id, JSON.stringify(data, null, 4));
          setLoginUserData({ ...data });
        }
      }, [data])

    useEffect(() => {
        // console.log("@@@ COUNTRY LIST: ", countryList().getData());
        if(informationOpen){
            let list = countryList().getData().filter((country) => (country.value === "IN") || (country.value === "US"));
            list = list.map((item) => {
                return {
                    ...item,
                    code: (item.value === "IN")? "91+" : "1+"
                }
            })
            setCountryNamesList(list);
        }
    }, [informationOpen])

    function selectCountry(data: any){
        // console.log("### COUNTRY: ", data);
        const findCountry = countryNamesList.find((item) => item.value === data)
        if(findCountry){
            setSelectedCountry(`${data} ${findCountry?.code}`);
        }else{
            setSelectedCountry(data);
        }
    }

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
        // console.log("USER DETAILS: ", userDetails.image);
        const keyItems: string[] = Object.keys(userDetails).filter((item) => {
            if((item === "image")){
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
    <Modal show={informationOpen} onHide={() => setInformationOpen(!informationOpen)} centered dialogClassName="modal-90w" className="information-modal modal-dialog2 modal-content2">
    <>
      <div className="p-3 dropDownPosition" >
        <div className="modal-header mx-2 px-0 pt-1 pb-3 mb-3 generic-modal-header">
            <p className="mb-0 fw-semibold mx-0 generic_modal_title">{(user)? "Employees Information" : "Add Employee"}</p>
        </div>
        <div className="container">
            <div className="flex d-flex mb-3">
                <div className="me-3" style={{ cursor: 'pointer' }} 
                onClick={() => setCropOpen(!cropOpen)}
                >
                    <img
                        src={userDetails?.image || pic}
                        className="profile" 
                        alt="Upload"
                    />
                    
                </div>
                <div className="d-flex flex-column pt-2" onClick={() => setCropOpen(!cropOpen)} style={{ cursor: 'pointer' }}>
                    <p className="text-primary mb-0" style={{fontWeight:"600"}}>Upload Your Profile</p>
                    <p className="text-secondary" style={{fontSize: "0.8rem"}}>Max. 800x400px</p>
                </div>
                <Form.Group controlId="formFile" className="mb-3">
                {/* <Form.Control
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                /> */}
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
                        className="custom-dropdown-toggle res wspace"
                    >
                        {selectRole || "Select role"}
                    </Dropdown.Toggle>
 
                    <Dropdown.Menu className="custom-dropdown-menu ">
                        {(selectRole) && (
                            <Dropdown.Item key={'selectRole1'} className={"bgClass wspace"} eventKey={selectRole}>{selectRole}</Dropdown.Item>
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
            <div className="flex   d-block d-md-flex  justify-content-between mt-3">
                <div>
                <Form.Label>First Name <span className="imp">*</span></Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    autoFocus
                    value={userDetails?.first_name}
                    onChange={(e) => {
                        const regex = /[^A-Za-z0-9.,' ']/g;
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
                            const regex = /[^A-Za-z0-9.,' ']/g;
                            setUserDetails({
                                ...userDetails,
                                last_name: e.target.value.replace(regex, '')
                            });
                        }}
                    />
                </div>
            </div>
            <div className="flex   d-block d-md-flex  justify-content-between mt-3">
                <div>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        autoFocus
                        disabled={(loginUserData.role_id !== 1 && user)? true : false}
                        value={userDetails?.email}
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
                    <PhoneInput
                        disabled={(loginUserData.role_id !== 1 && user)? true : false}
                        inputStyle={{
                            width: '200.5px', height: '38px'
                        }}
                        enableSearch
                        inputClass="phoneInp"
                        country={'in'}
                        value={userDetails?.phone}
                        onChange={phone => {
                            setUserDetails({
                                ...userDetails,
                                phone: phone
                            });
                        }}
                    />
                    <div className="">
                        {/* <Form.Control
                            type="text"
                            placeholder="Phone"
                            autoFocus
                            maxLength={16}
                            value={userDetails.phone}
                            onChange={(e) => {
                                let value = e.target.value
                                if(value[0] === '+'){
                                    value = '+' + value.slice(1).replace(/\D/g,'');
                                }else{
                                    value = value.replace(/\D/g,'');
                                }
                                if(value.length > 16){
                                    value = value.substring(0, 16)

                                }
                                setUserDetails({
                                    ...userDetails,
                                    phone: value
                                });
                            }}
                        /> */}
                    </div>
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
                <img
                src={`/assets/Icon/Eye ${passwordToggle ?  'Show' : 'Off'} Pass.svg`}
                onClick={()=>{setPasswordToggle(!passwordToggle)}} className="eye"/>
            </div>

        </div>
      </div>
    <div className="d-flex justify-content-end mt-1 modal-footer generic-modal-footer generic-modal-footer2">
        <Button className="edit_cancel_button edit_cancel_button2 border_radius_8" variant="light" onClick={()=>{ handleCloseModal() }}>
            Cancel
        </Button>
        <Button variant="primary" className="generic_apply_button border_radius_8"
            disabled={disableInfoModalButton}
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
            {(user)? "Apply Changes" : "Apply Changes"}
        </Button>
    </div>
    </>
    </Modal>
  );
};

export default InformationModal;