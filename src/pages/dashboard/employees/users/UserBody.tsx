import React, { ReactNode, useContext, useEffect, useState } from "react";
import "./employee-detail.scss";
import ActiveDeactiveModal from "./ActiveDeactiveModal";

import DeleteModal from "./DeleteModal";
import { API } from "@/api";
import {
  createUpdateUser,
  deleteEmployee,
  getRoles,
  updateEmployeeStatus,
} from "@/api/users";
import EmployeeHeader from "./EmployeeHeader";
import useDebounce from "@/utils/hooks/debounce";
import { userSearchFilter } from "@/search/users";
import { Role } from "../roles/RolesBody";
import InformationModal from "./InformationModal";
import ImageCropModal from "./Modal";
import NewLoader from "@/components/LoadingTd";
import { TOKEN_STORAGE } from "@/utils/constants";
import {
  useGetUserMutation,
  useLogoutMutation,
} from "@/state/slices/authApiSlice";
import { logout } from "@/utils/helper";
import { LoginUserContext } from "@/App";
import { useNavigate } from "react-router-dom";

// import "./UserBody.css";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  email_verified_at: null | string;
  role_id: number;
  image: null | string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  name: string;
  role_name: string;
  image_path: string;
  loading: boolean;
}

export interface UserRole {
  id: number;
  name: string;
  users: number;
}

export interface UserDetails {
  role_id: number | null;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  image: string | null;
  email: string;
  emailError: boolean;
}

const resetUserDetails = {
  role_id: null,
  first_name: "",
  last_name: "",
  phone: "",
  password: "",
  image: "",
  email: "",
  emailError: true,
};

const UserBody: React.FC = () => {
  const context = useContext(LoginUserContext);
  const navigate = useNavigate();
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // State to manage login status

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [informationOpen, setInformationOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [disableInfoModalButton, setDisableInfoModalButton] = useState(false);
  const [usersList, setUsersList] = useState<User[] | []>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteSelectedUser, setDeleteSelectedUser] = useState<User | null>(
    null
  );
  const [activeDeactiveUser, setActiveDeactiveUser] = useState<User | null>(
    null
  );
  const [editSelectedUser, setEditSelectedUser] = useState<User | null>(null);

  const [selectedOption, setSelectedOption] = useState("Select Role");
  const [userDetails, setUserDetails] = useState<UserDetails | null>();
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[] | []>([]);
  const [croppedImage, setCroppedImage] = useState<Blob | null>();
  const debouncedSearch = useDebounce(searchText, 1000);

  const [loginUserData, setLoginUserData] = useState<User | null>(null);
  const authToken = localStorage.getItem(TOKEN_STORAGE);

  function logout() {
    // navigate("/");
    // localStorage.removeItem(TOKEN_STORAGE);
  }

  useEffect(() => {
    if (context?.loginUserData) {
      const data = context?.loginUserData?.role?.permissions;
      const filteredData = data.filter((item: any) => item.id === 20);
      if (filteredData.length > 0) {
        setCanDelete(true);
      } else {
        setCanDelete(false);
      }
    }
  }, [context]);

  useEffect(() => {
    if (context?.loginUserData) {
      const data = context?.loginUserData?.role?.permissions;
      const filteredData = data.filter((item: any) => item.id === 19);
      if (filteredData.length > 0) {
        setCanEdit(true);
      } else {
        setCanEdit(false);
      }
    }
  }, [context]);

  useEffect(() => {
    if (context?.loginUserData) {
      const data: any = context?.loginUserData;
      console.log(data);
      setLoginUserData(data);

      console.log(data?.role?.permissions, "-------loginUserData");
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      const result = userSearchFilter(debouncedSearch, usersList);
      setSearchResults(result);
      // console.log("#### SEARCH RESULTS: ", result);
    }
  }, [debouncedSearch]);

  const handleSelect = (eventKey: string) => {
    const findRole = userRoles.find((item) => item.name === eventKey);
    if (findRole) {
      setUserDetails((old: any) => {
        return {
          ...old,
          role_id: findRole.id,
        };
      });
    }
  };

  useEffect(() => {
    if (deleteSelectedUser) {
      setDeleteOpen(!deleteOpen);
    }
  }, [deleteSelectedUser]);

  useEffect(() => {
    if (activeDeactiveUser) {
      setDeactivateOpen(!deactivateOpen);
    }
  }, [activeDeactiveUser]);

  useEffect(() => {
    if (!informationOpen) {
      setEditSelectedUser(null);
      setCroppedImage(null);
      setUserDetails(resetUserDetails);
    }
  }, [informationOpen]);

  useEffect(() => {
    if (editSelectedUser && userDetails) {
      setInformationOpen(!informationOpen);
    }
  }, [editSelectedUser]);

  useEffect(() => {
    getUsersList();
    fetchRoles();
  }, []);

  // useEffect(()=>{
  //   if(userRoles.length === 0){
  //   }
  // }, [userRoles])

  async function deleteUser(id: number) {
    try {
      const response = await deleteEmployee(id);
      alert("Deleted");
      setSearchText("");
      setSearchResults([]);
      getUsersList();
    } catch (error) {
      console.log("!!! DELETE USER ERROR: ", error);
    }
  }

  async function getUsersList(changedUser: User | null = null) {
    try {
      setLoading(true); // Set loading to true before making API call

      const response = await API.post("users", null);
      const data: User[] | [] = response.data;
      setUsersList(data);
      if (searchText && changedUser) {
        const extractUpdatedUser = data.find(
          (item) => item.id === changedUser.id
        );
        if (extractUpdatedUser) {
          const updateSearchResult: User[] | [] = searchResults.map((item) => {
            if (item.id === changedUser.id) {
              return extractUpdatedUser;
            }
            return item;
          });
          if (updateSearchResult.length > 0) {
            setSearchResults(updateSearchResult);
          }
        }
      }
    } catch (error: any) {
      console.log("!!! USERS ERROR: ", error);
      if (error?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  }

  async function updateUserStatus(data: string) {
    try {
      const response = await updateEmployeeStatus(data);
      getUsersList();
    } catch (error) {
      console.log("!!! UPDATE USER STATUS ERROR: ", error);
    }
  }

  async function fetchRoles() {
    try {
      const response = await getRoles();
      let data: Role[] = response.data;
      data = data.sort((a, b) => a.id - b.id);
      setUserRoles(data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        logout();
      }
      console.log("!!! FETCH ROLES ERROR: ", error);
    }
  }

  async function createUpdateUserAPI() {
    try {
      setDisableInfoModalButton(true);
      let data: string = editSelectedUser
        ? `update/${editSelectedUser?.id}}`
        : "create";
      if (editSelectedUser) {
        const decodedUrl = decodeURIComponent(data);
        // Remove the "}" character
        data = decodedUrl.replace(/}/g, "");
      }
      let changedUser: User | null = null;
      if (editSelectedUser) {
        changedUser = Object.assign({}, editSelectedUser);
      }
      const formData = new FormData();
      if (userDetails) {
        formData.append("first_name", userDetails?.first_name);
        formData.append("last_name", userDetails?.last_name);
        formData.append("email", userDetails?.email);
        formData.append("phone", `+${userDetails?.phone}`);
        formData.append("role_id", String(userDetails?.role_id));
        if (userDetails?.password) {
          formData.append("password", userDetails?.password);
        }
      }
      if (croppedImage) {
        formData.append("image", croppedImage);
      } else if (!editSelectedUser?.image_path) {
        const response = await fetch("/assets/image/no_image.jpeg");
        const blob = await response.blob();
        formData.append("image", blob);
      }
      console.log(
        "@@@ UPDATE USER: ",
        croppedImage,
        JSON.stringify(formData, null, 4)
      );
      // return;
      const response = await createUpdateUser(data.trim(), formData);
      setDisableInfoModalButton(false);
      setEditSelectedUser(null);
      setInformationOpen(!informationOpen);
      getUsersList(changedUser);
    } catch (error: any) {
      setDisableInfoModalButton(false);
      console.log("!!! UPDATE USER ERROR: ", error);
      if (error?.response?.status === 401) {
        alert(
          error?.response?.data?.message ||
            JSON.stringify(error?.response?.data, null, 4)
        );
      }
    }
  }

  function renderItem(item: User) {
    if (item?.is_deleted) {
      return null;
    }

    return (
      <>
        <div key={`${item?.id}userbody`} className="employee-card">
          <div className="details">
            <div className="d-flex gap-3 gapImg">
              <img
                src={item?.image_path || "/assets/image/no_image.jpeg"}
                alt="user_image"
                className="employee_image"
              />
              <div className="name">
                <span className="name_text">{item.name}</span>
                <div className="d-flex gap-2 gap_employee_number">
                  <img src="/assets/Icon/Phone Number.svg" alt="phone number" />
                  <span style={{ color: "#667085" }}>+{item.phone}</span>
                </div>
                <div className="d-flex gap-2 gap_employee_number">
                  <img
                    src="/assets/Icon/Manager.svg"
                    alt="role"
                    className="employee_number"
                  />
                  <span style={{ color: "#667085" }} className="truncate-text">
                    {item.role_name}
                  </span>
                </div>
              </div>
            </div>
            {/* <span className="suspended">Suspended</span> */}
            <span className={item?.is_active ? "active" : "suspended"}>
              {item?.is_active ? "Active" : "Suspended"}
            </span>
          </div>
          <div className="options">
            {canEdit ? (
              <button
                className="edit"
                onClick={() => {
                  setEditSelectedUser(item);
                  setUserDetails({
                    role_id: item.role_id,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    phone: item.phone,
                    password: "",
                    image: item.image_path,
                    email: item.email,
                    emailError: false,
                  });
                }}
              >
                Edit
              </button>
            ) : (
              <div style={{ width: "100px" }} />
            )}

            <div className="d-flex gap-2">
              {/* console.log(data?.role?.permissions, "-------loginUserData") */}

              {canDelete ? (
                <button
                  className="delete"
                  onClick={() => {
                    setDeleteSelectedUser(item);
                  }}
                >
                  Delete
                </button>
              ) : (
                <div style={{ width: "100px" }} />
              )}

              {!(item?.id === loginUserData?.id) && (
                <>
                  {item?.is_active ? (
                    <button
                      className="activate"
                      onClick={() => {
                        setActiveDeactiveUser(item);
                      }}
                    >
                      {item?.is_active ? "Deactivate" : "Activate"}
                    </button>
                  ) : (
                    <button
                      className="deactivate"
                      onClick={() => {
                        setActiveDeactiveUser(item);
                      }}
                    >
                      {item?.is_active ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </>
                //  <button className="activate deactivate" onClick={() => { setActiveDeactiveUser(item) }}>
                //   {(item?.is_active) ? "Deactivate" : "Activate"}
                // </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <EmployeeHeader
        setInformationOpen={() => setInformationOpen(!informationOpen)}
        searchText={searchText}
        setSearchText={(text: string) => setSearchText(text)}
      />
      <div className="employee-detail-page bg-pure-white">
        <ActiveDeactiveModal
          selectedUser={activeDeactiveUser}
          deactivateOpen={deactivateOpen}
          setDeactivateOpen={() => setDeactivateOpen(!deactivateOpen)}
          setSelectedUser={() => setActiveDeactiveUser(null)}
          updateUserStatus={() => {
            const data = `id=${
              activeDeactiveUser?.id
            }&status=${!activeDeactiveUser?.is_active}`;
            updateUserStatus(data);
          }}
        />
        {(informationOpen || (editSelectedUser && userDetails)) && (
          <InformationModal
            disableInfoModalButton={disableInfoModalButton}
            cropOpen={cropOpen}
            setCropOpen={setCropOpen}
            userRoles={userRoles}
            selectedUser={editSelectedUser}
            informationOpen={informationOpen}
            setInformationOpen={setInformationOpen}
            handleSelect={handleSelect}
            selectedOption={selectedOption}
            userDetails={userDetails}
            setUserDetails={(details: UserDetails) =>
              setUserDetails({
                ...userDetails,
                ...details,
              })
            }
            createUpdateUserAPI={createUpdateUserAPI}
          />
        )}
        <DeleteModal
          selectedUser={deleteSelectedUser}
          deleteOpen={deleteOpen}
          setDeleteOpen={() => setDeleteOpen(!deleteOpen)}
          setSelectedUser={() => setDeleteSelectedUser(null)}
          deleteUser={() => {
            if (deleteSelectedUser?.id) {
              deleteUser(deleteSelectedUser?.id);
              setDeleteOpen(!deleteOpen);
            }
          }}
        />

        {cropOpen && (
          <ImageCropModal
            cropOpen={cropOpen}
            setCropOpen={setCropOpen}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setCroppedImage={setCroppedImage}
          />
        )}

        {loading && (
          <div className="d-flex justify-content-center mt-4">
            <div className="loading-row newLoaderAnimation">
              <NewLoader cols={5} />
            </div>
          </div>
        )}

        <div className="content">
          {!debouncedSearch
            ? usersList?.map((item: User): ReactNode => renderItem(item))
            : searchResults?.map((item: User): ReactNode => renderItem(item))}

          {/* {(!debouncedSearch && !loading) ? (
            usersList.map((item: User): ReactNode => renderItem(item))
          ) : (
            searchResults.map((item: User): ReactNode => renderItem(item))
          )} */}
        </div>

        {/* <span>Hello world!</span> */}
      </div>
    </>
  );
};

export default UserBody;
