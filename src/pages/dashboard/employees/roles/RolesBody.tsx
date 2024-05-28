import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Input from "@/pages/(auth)/components/Input";
import "./RolesBody.css";
import DeleteRoleModal from "./DeleteRoleModel";

const roles = [
  {
    id: "1",
    title: "Admin",
    subTitle: "8 Users",
  },
  {
    id: "2",
    title: "Manager",
    subTitle: "8 Users",
  },
  {
    id: "3",
    title: "Sales Associate",
    subTitle: "8 Users",
  },
  {
    id: "4",
    title: "Delivery Associate",
    subTitle: "8 Users",
  },
  // {
  //     id: '5',
  //     title: 'Admin',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '6',
  //     title: 'Manager',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '7',
  //     title: 'Sales Associate',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '8',
  //     title: 'Delivery Associate',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '1',
  //     title: 'Admin',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '9',
  //     title: 'Manager',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '10',
  //     title: 'Sales Associate',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '11',
  //     title: 'Delivery Associate',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '12',
  //     title: 'Admin',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '13',
  //     title: 'Manager',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '14',
  //     title: 'Sales Associate',
  //     subTitle: '8 Users'
  // },
  // {
  //     id: '15',
  //     title: 'Delivery Associate',
  //     subTitle: '8 Users'
  // }
];

const screens = [
  {
    id: "table1",
    name: "Invoices",
  },
  {
    id: "table2",
    name: "Batches",
  },
  {
    id: "table3",
    name: "Payments",
  },
  {
    id: "table4",
    name: "Employees-Users",
  },
  {
    id: "table5",
    name: "Employees-Roles",
  },
  {
    id: "table6",
    name: "Vehicles",
  },
];

const RolesBody = () => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [roles2, setRoles2] = useState(roles);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState<boolean | null>(false);
  const [showEditInput, setShowEditInput] = useState<boolean | null>(false);
  const [editValue, setEditValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleButtonClick = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    event.preventDefault();
    console.log(inputValue);
    setEditValue(event.target.value);
  };

  const handleAddRole = () => {
    console.log("====================================");
    console.log("rieojtwjt");
    console.log("====================================");
    if (inputValue.trim() === "") return;

    const newRole = {
      id: (roles2.length + 1).toString(),
      title: inputValue,
      subTitle: "0 Users", // Default subTitle for new roles
    };
    setRoles2([...roles2, newRole]);
    setShowInput(false);
    setInputValue("");
  };

  const handleEditClick = () => {
    setShowEditInput(!showEditInput);
    setEditValue(roles2[selectedRole!].title)
};

  const editRole = (index: any) => {
    let new_roles = roles2;
    new_roles[index].title = editValue;
    setRoles2(new_roles);
    setEditValue("");
    setShowEditInput(false);
  }

  return (
    <div className="container-fluid px-0">
        <DeleteRoleModal
            deleteModalOpen = {deleteModalOpen}
            setDeleteModalOpen = {setDeleteModalOpen}
            role = {roles2[selectedRole!]}
        />
      <div className="row">
        <div className="col-md-3">
          <div
            className="bg-white p-3 border border-radius overflow-y-scroll"
            style={{}}
          >
            <h5 className="head-font">Roles</h5>
            <div
              className="overflow-y-scroll"
              style={{ maxHeight: "510px", minHeight: "510px" }}
            >
              {roles2.map((role, index) => {
                if (selectedRole === index) {
                  return (
                    <div>
                      {showEditInput && (
                        <>
                          <div className="position-relative">
                            <input
                              className="form-control mb-1"
                              type="text"
                              placeholder={role.title}
                              value={editValue}
                              onChange={handleInputChange}
                            />
                            <button
                              className="position-absolute top-50  translate-middle-y btn btn-link p-0 m-0"
                              onClick={() => {editRole(index)}}
                              style={{ right: "15px" }}
                            >
                              <span className="text-primary ">Save</span>
                            </button>
                          </div>
                        </>
                      )}

                      <div
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#0080FC",
                        }}
                        className="d-flex gap-3 justify-content-between align-items-center px-2 rounded py-1 "
                        key={`role${role.id}`}
                      >
                        <div className="py-2 lh-1" key={`role${role.id}`}>
                          <p className="m-0 title-font text-white">
                            {role.title}
                          </p>
                          <small className="m-0 subTitle-font text-white">
                            ({role.subTitle})
                          </small>
                        </div>
                        <div>
                          <ul className="list-unstyled lh-lg d-flex gap-2 m-0">
                            <li
                              onClick={() => {
                                handleEditClick();
                              }}
                            >
                              <img
                                src="/assets/Icon/Edit-White.svg"
                                className="text-white"
                                alt="edit"
                              />
                            </li>
                            <li
                            onClick={()=>{
                                setDeleteModalOpen(!deleteModalOpen)
                              }}
                            >
                              <img
                                src="/assets/Icon/trash-white.svg"
                                alt="trash"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedRole(index);
                      setShowEditInput(false);
                    }}
                    className="d-flex gap-3 justify-content-between align-items-center px-2 py-1"
                    key={`role${role.id}`}
                  >
                    <div className="py-2 lh-1" key={`role${role.id}`}>
                      <p className="m-0 title-font">{role.title}</p>
                      <small className="m-0 subTitle-font">
                        ({role.subTitle})
                      </small>
                    </div>
                    <div>
                      <ul className="list-unstyled lh-lg d-flex gap-2 m-0">
                        <li>
                          <img src="/assets/Icon/Edit.svg" alt="edit" />
                        </li>
                        <li>
                          <img src="/assets/Icon/trash.svg" alt="trash" />
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              {showInput && (
                <>
                  <div className="position-relative">
                    <input
                      className="form-control mb-3"
                      type="text"
                      placeholder="Role Name"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    {inputValue && (
                      <button
                        className="position-absolute top-50  translate-middle-y btn btn-link p-0 m-0"
                        onClick={() => setInputValue("")}
                        style={{ right: "15px" }}
                      >
                        <img src="/assets/Icon/close-circle.svg" alt="clear" />
                      </button>
                    )}
                  </div>
                </>
              )}
              {showInput ? (
                <button
                  className="btn btn-primary w-100 mx-auto"
                  onClick={handleAddRole}
                >
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-primary w-100 mx-auto"
                  onClick={handleButtonClick}
                >
                  {" "}
                  + Add new role
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div
            className="bg-white border"
            style={{ borderRadius: "12px", overflow: "hidden" }}
          >
            <div
              className="p-3 pb-1 border-bottom"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <h5 className="head-font">Manager</h5>
            </div>
            <div
              className="overflow-y-scroll p-3"
              style={{ maxHeight: "575px", minHeight: "575px" }}
            >
              <div className="table-responsive">
                <table className="table  border">
                  <thead style={{ backgroundColor: "#F9FAFB" }}>
                    <tr>
                      <th style={{ backgroundColor: "#F9FAFB" }} scope="col">
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Module
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          View
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Create
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Edit
                        </p>
                      </th>
                      <th
                        className="text-center"
                        style={{ backgroundColor: "#F9FAFB" }}
                        scope="col"
                      >
                        <p
                          className="m-0 py-1"
                          style={{ fontSize: "14px", fontWeight: "normal" }}
                        >
                          Delete
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {screens.map((screen) => {
                      return (
                        <tr key={screen.id} className="">
                          <td className="" scope="row">
                            <p style={{}} className="my-1 py-1">
                              {screen.name}
                            </p>
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ marginTop: "12px" }}
                              className="py-1"
                              type="checkbox"
                              name=""
                              id=""
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesBody;
