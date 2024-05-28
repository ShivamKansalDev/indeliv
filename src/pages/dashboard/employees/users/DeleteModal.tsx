import { Button, Modal } from "react-bootstrap";

type Props = {}

interface User{
  id: number;
  image: string;
  name: string;
  mobile: string;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
}

const DeleteModal = (props: any) => {
  const {
    deleteOpen = false,
    setDeleteOpen = () => {},
    setSelectedUser = () => {},
    deleteUser = () => {}
  } = props;
  const user: User = props.selectedUser;
  return (
    <Modal show={deleteOpen} 
    className="delete-modal" centered
    onHide={()=> {
      setDeleteOpen(!deleteOpen)
      setSelectedUser()
    }}
>
      <div className="p-3">
        <div className="flex d-flex justify-content-center">
          <img src="/assets/image/user.png" alt="Rajat" className=""/>
        </div>

        <div className="text-center my-3">
          <h6 className="">Are you sure you want to delete</h6> 
          <h6> {user?.name}?</h6>
        </div>

        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="light" onClick={()=>{setDeleteOpen(false)}}>No</Button>
          <Button variant="danger" onClick={deleteUser}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;