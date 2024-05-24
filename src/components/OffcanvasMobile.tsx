import { Offcanvas } from "react-bootstrap";
import { ReactComponent as Call } from "@/assets/svgs/call.svg";
import { ReactComponent as List } from "@/assets/svgs/list.svg";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/state/hooks";
import { useGetUserMutation, useLogoutMutation } from "@/state/slices/authApiSlice";
import { clearState } from "@/state/slices/invoices/invoicesSlice";
import { isLoggedIn } from "@/utils/helper";
import { LoginUserContext } from "@/App";

interface HeaderProps {
    isShow?: boolean;
    setIsShow: Function;
}
interface User {
    id?: number;
    name?: string;
    email?: string;
    role_name?: string;
    image_path?: string;
}
export default function OffcanvasMobile() {
    const context = useContext(LoginUserContext)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [lgOpen, setLgOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    const [logout, { isSuccess, isLoading, isError }] = useLogoutMutation();
    const [userData, setUserData] = useState<User>({});

    // const [getUser, { data: user, isSuccess: datSuccess }] = useGetUserMutation();
    // useEffect(() => {
    //     getUser();
    // }, [])
    useEffect(() => {
        if (context?.loginUserData && context?.loginUserData?.role_name) {
            setUserData({ ...context?.loginUserData }); // Update state when data is available
        }
    }, [context]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    return <>
        <div>
            <List onClick={handleShow} />
        </div>
        <Offcanvas show={show} onHide={handleClose}>
            {/* <Offcanvas.Header >
                <Offcanvas.Title className=""> */}
            <nav
                style={{ background: "white" }}
                className={`header-component d-flex justify-content-between align-items-center header navbar-expand-lg  ${lgOpen && "lg-open"
                    }`}
            >
                <Link className="navbar-brand mob" to="/">
                    <img
                        src={"/assets/image/Group 9580.svg"}
                        alt="Logo"
                        height="30"
                        width="137"
                    />
                </Link>
                <div
                    className={`user-container ${lgOpen && "lg-open"}`}
                    onClick={() => setLgOpen((l) => !l)}
                    style={{ background: "#FEFEFE" }}
                >
                    <div style={{ background: "#FEFEFE", borderBottom: "none" }}>
                        <img
                            // src="/assets/image/user-smile.png"
                            src={userData?.image_path}
                            alt="User Avatar"
                            className="user-avatar"
                        />
                        <div className="user-info">
                            <span className="user-name">{userData?.name}</span>
                            <span className="user-organization">Organization</span>
                        </div>
                        <img
                            className="logout-arrow"
                            src="/assets/Icon/Down Arrow.svg"
                            alt="User Avatar"
                        />
                    </div>
                    <button
                        className="logout-btn bg-white"
                        onClick={async () => {
                            dispatch(clearState());
                            localStorage.removeItem("scrollPosition");
                            await logout();
                            context?.setAuthContext("");
                            context?.setLoginUserData({});
                            setLoggedIn(false);
                            navigate("/login");
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </nav>
            {/* </Offcanvas.Title>
            </Offcanvas.Header> */}
            <Offcanvas.Body>
                <button className="btn btn-primary w-100 text-start">
                    <span style={{ fontSize: "16px", fontWeight: "500" }}> <Call />&nbsp;Help</span>
                </button>
            </Offcanvas.Body>
        </Offcanvas>
    </>;
}
