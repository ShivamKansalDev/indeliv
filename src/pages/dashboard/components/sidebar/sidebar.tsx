import { Link } from "react-router-dom";
import "./sidebar.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoginUserContext } from "@/App";



interface SidebarProps {
  setOpenNav?: any;
}


export default function SideBar({ setOpenNav }: SidebarProps) {
  const context = useContext(LoginUserContext);
  const [userData, setUserData] = useState<any>({});
  const [selectedEmployee, setSelectedEmployee] = useState<boolean>(false);
  useEffect(() => {
    // console.log("data changed", data);
    // console.log(context?.loginUserData, 'auth')
    if (context?.loginUserData && context?.loginUserData?.role_name) {
      setUserData({ ...context?.loginUserData }); // Update state when data is available
    }
  }, [context]);
  const hasAccess = useCallback(
    (module: string) => !!userData?.role?.permissions?.find((e: any) => e?.name?.includes(module)),
    [userData?.role?.permissions]
  );
  const location = useLocation();

  const menus = [
    hasAccess("invoice") && {
      name: "Invoices",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Invoices-white.svg"
          : "/assets/Icon/Invoices.svg";
      },
      link: "/dashboard/invoices",
    },
    hasAccess("batches") && {
      name: "Batches",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Batches-white.svg"
          : "/assets/Icon/Batches.svg";
      },
      link: "/dashboard/batches",
    },
    hasAccess("payments") && {
      name: "Payments",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Payments-white.svg"
          : "/assets/Icon/Payments.svg";
      },
      link: "/dashboard/payments",
    },
    hasAccess("employees") && {
      name: "Employees",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Employees-white.svg"
          : "/assets/Icon/Employees.svg";
      },
      rightIcon: (active: boolean) => {
        return active
          ? "/assets/Icon/arrow-down-white.svg"
          : "/assets/Icon/arrow-down-gray.svg";
      },
      screens: [
        {
          id: "empScreen1",
          name: "Users"
        },
        {
          id: "empScreen2",
          name: "Roles"
        }
      ],
      link: "/dashboard/employees/users",
    },
    hasAccess("vehicle") && {
      name: "Vehicles",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Vehicles-white.svg"
          : "/assets/Icon/Vehicles.svg";
      },
      link: "/dashboard/vehicles",
    },
    hasAccess("delivery") && !hasAccess("batches_view") && {
      name: "Deliveries",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Batches-white.svg"
          : "/assets/Icon/Batches.svg";
      },
      link: "/dashboard/delivery/associates",
    },
    hasAccess("collection") && !hasAccess("batches_view") && {
      name: "Collection",
      icon: (active: boolean) => {
        return active
          ? "/assets/Icon/Batches-white.svg"
          : "/assets/Icon/Batches.svg";
      },
      link: "/dashboard/collection/associates",
    },
  ].filter(Boolean);
  return (
    <>
      {/* #router  */}
      {/* <div className="d-flex flex-column sidebar  menu-container flex-shrink-0  ">
        <ul className="nav nav-pills flex-column mb-auto">
          {menus.map((menu, index) => (
            <li key={index} className="nav-item" onClick={() => setOpenNav?.(false)}>
              <a className={`nav-link d-flex sidebar-link ${location.pathname.startsWith(menu.link) ? 'active' : menu.name == "Batches" ? location.pathname.startsWith('/dashboard/batch') ? 'active' : '' : '' }`} href={'#'+menu.link}>
                <img
                  src={menu.icon(location.pathname.startsWith(menu.link) ? true : menu.name == "Batches" ? location.pathname.startsWith('/dashboard/batch') ? true : false : false)}
                  alt={menu.name}
                />
                <span>{menu.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="d-flex flex-column sidebar  menu-container flex-shrink-0  ">
        <ul className="nav nav-pills flex-column mb-auto">
          {menus?.map((menu: any, index: number) => (
            <li key={index} className="nav-item" onClick={() => {
              setOpenNav?.(false);
              if(menu?.name === "Employees"){
                setSelectedEmployee(!selectedEmployee)
              }else{
                setSelectedEmployee(false)
              }
            }}>
              <div>
                <Link className={`nav-link d-flex sidebar-link ${location.pathname.startsWith(menu?.link) ? 'active' : menu?.name == "Batches" ? location.pathname.startsWith('/dashboard/batch') ? 'active' : '' : ''}`} to={menu?.link}>
                  <img
                    src={menu?.icon(location.pathname.startsWith(menu.link) ? true : menu?.name == "Batches" ? location.pathname.startsWith('/dashboard/batch') ? true : false : false)}
                    alt={menu?.name}
                  />
                  <span>{menu?.name}</span>
                  {(menu?.name === "Employees") && (
                    <img 
                      src={menu?.rightIcon(location.pathname.startsWith(menu.link) ? true : menu?.name == "Employees" ?       location.pathname.startsWith('/dashboard/employees') ? true : false : false)}
                      alt={menu.name}
                    />
                  )}
                </Link>
              </div>
              {(selectedEmployee && (menu.name === "Employees")) && (
                (Array.isArray(menu?.screens)) && menu?.screens?.map((screen: any) => {
                  return (
                    <div key={screen?.id}>
                      <span>{screen?.name}</span>
                    </div>
                  );
                })
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* {!location.pathname.includes("details") && (
        <div className="search-bar  px-4 pt-4" style={{ width: "100%" }}>
          <div className="search-bar-input w-100">
            <img
              src={"/assets/image/textalign-left.svg"}
              // onClick={() => setIsShow(true)}
              alt="User Avatar"
            />
            <input
              style={{ height: "50px" }}
              className="w-100 bg-gray"
              type="text"
              placeholder="Search By Name or Invoice Number"
            />
          </div>
        </div>
      )} */}
    </>
  );
}
