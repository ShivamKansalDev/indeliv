import "./dashboard.scss";
import Sidebar from "@/pages/dashboard/components/sidebar/sidebar";
import Header from "@/pages/dashboard/components/header/header";
import React, { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { isLoggedIn } from "@/utils/helper";
import { useGetUserMutation } from "@/state/slices/authApiSlice";
import permissions from "@/ennum/permission";
interface User {
    id?: number;
    name?: string;
    email?: string;
    role_name?: string;
}
export default function Dashboard() {
    const [openNav, setOpenNav] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    const [getUser, { data, isSuccess }] = useGetUserMutation();
    const [userData, setUserData] = useState<User>({})

    useEffect(() => {
        console.log('src\pages\dashboard\batchs\index.tsx');
        getUser();
    }, []);
    useEffect(() => {
        if (data) {
            setUserData(data); // Update state when data is available
        }
    }, [data, isSuccess]);
    return (
        <div className={`dashboard-layout-component ${openNav && "open"}`}>
            {/* <div className="header"> */}
            <Header user={data} setLoggedIn={setLoggedIn} setOpenNav={setOpenNav} />
            {/* </div> */}
            <div className="d-flex  ">
                {
                    // userData?.role_name !== permissions?.role_name &&
                    <div className="side-bar col-4">
                        <Sidebar setOpenNav={setOpenNav} />
                    </div>
                }
                <div
                    className="flex-grow-1 dashboard-content-container"
                    onMouseDown={() => setOpenNav(false)}
                >
                    <div className="invoice-component">
                        <div className="content">
                            <Outlet context={{ setOpenNav } satisfies ContextType} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

type ContextType = {
    setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useSetOpenNav() {
    return useOutletContext<ContextType>();
}
