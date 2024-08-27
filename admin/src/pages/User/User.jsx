import React, { useState, useEffect } from 'react';
import './user.css';
import axios from "axios";
import { toast } from "react-toastify";
import { MdEdit, MdDelete } from 'react-icons/md'; // Material Design icons

const Users = () => {
    const url = "http://localhost:4000";
    const [users, setUsers] = useState([]);
    const [updateUsers, setUpdateUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
    const [editUser, setEditUser] = useState({ name: "", email: "", password: "", id: "" });

    useEffect(() => {
        axios.get(`${url}/api/user/userDetails`)
            .then(response => {
                console.log('Fetched users:', response.data.users);
                if (Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                } else {
                    console.error('Unexpected response format:', response.data);
                    toast.error('Unexpected data format from server');
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                toast.error('Error fetching users');
            });
    }, [url]);


    const handleAddUser = () => {
        // Send new user data to the server
        axios.post(`${url}/api/user/register`, newUser)
            .then(response => {
                setUsers([...users, response.data]); // Add new user to the list
                setShowModal(false); // Close modal
                toast.success('User added successfully!');
            })
            .catch(error => toast.error('Error adding user'));
    };
    const handleUpdateUser = () => {
        // Send updated user data to the server
        axios.put(`${url}/api/user/updateDetails/${editUser.id}`, editUser) // Pass user ID in the URL and user data in the body
            .then(response => {
                setUsers(users.map(user => 
                    user.id === editUser.id ? response.data.user : user
                )); // Update user in the list
                setShowModal(false); // Close modal
                toast.success('User updated successfully!');
            })
            .catch(error => {
                console.error('Error updating user:', error);
                toast.error(error);
            });
    };
    
    

    const handleDeleteUser = (id) => {
        // Send delete request to the server
        axios.delete(`/api/users/${id}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== id)); // Remove deleted user from the list
                toast.success('User deleted successfully!');
            })
            .catch(error => toast.error('Error deleting user'));
    };

    const handleEditUser = (id) => {
        // Show the edit modal
        toast.info(`Edit user with id: ${id}`);

        // Fetch user details for editing
        axios.get(`${url}/api/user/userEditDetails/${id}`)
            .then(response => {
                const user = response.data.user;
                console.log(response.data)
                if (user) {
                    // Update the state with fetched user details
                    setEditUser({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password
                    });
                    setShowEditModal(true);
                } else {
                    console.error('Unexpected response format:', response.data);
                    toast.error('Unexpected data format from server');
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                toast.error('Error fetching user details');
            });
    };



    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const closeEditModal = () => setShowEditModal(false);

    return (
        <div className="users-panel">
            <h2>Users Management</h2>

            <button className="add-user-btn" onClick={openModal}>Add User</button>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Cart</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.totalCartItems}</td>
                            <td>
                                <button onClick={() => handleEditUser(user.id)} className="action-btn">
                                    <MdEdit size={20} />
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="action-btn delete-btn">
                                    <MdDelete size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Adding New User */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add New User</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                            <input
                                type="Password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                            <button type="submit">Add User</button>
                        </form>
                        <button className="close-modal" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
            {/* {Modal for Editing user} */}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit User</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateUser(); // Ensure this function is correct for editing
                        }}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={editUser.name || ''} // Ensure a default value to avoid uncontrolled input
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editUser.email || ''} // Ensure a default value
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                value={editUser.id || ''} // Ensure a default value
                                onChange={(e) => setEditUser({ ...editUser, id: e.target.value })}
                                hidden
                                required
                            />
                            <input
                                type="password" // Change type to password for password input
                                placeholder="Password"
                                value={editUser.password || ''} // Ensure a default value
                                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                required
                            />
                            <button type="submit">Edit User</button>
                        </form>
                        <button className="close-modal" onClick={closeEditModal}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Users;
