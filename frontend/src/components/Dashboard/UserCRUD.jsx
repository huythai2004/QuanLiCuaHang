import React, { useState } from "react";
import "../../css/main.css";
import "../../css/util.css";
import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";

const UserCRUD = ({ users, onRefresh, onUpdateStats }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    enabled: true,
  });

  // Extract role codes from role objects or use string roles directly
  const getRoleCode = (role) => {
    if (typeof role === "string") return role;
    if (role && role.code) return role.code;
    if (role && role.name) return role.name;
    return "CUSTOMER";
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      enabled: true,
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      enabled: user.enabled !== undefined ? user.enabled : true,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      const userData = {
        username: userForm.username,
        fullName: userForm.fullName,
        email: userForm.email,
        phone: userForm.phone,
        address: userForm.address,
        enabled: userForm.enabled,
      };

      let response;
      if (editingUser) {
        // Update
        response = await fetch(
          `http://localhost:8080/users/${editingUser.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          }
        );
      } else {
        // Create
        response = await fetch("http://localhost:8080/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
      }

      if (response.ok) {
        alert(
          editingUser
            ? "Cập nhật người dùng thành công!"
            : "Tạo người dùng thành công!"
        );
        setShowUserModal(false);
        if (onRefresh) onRefresh();
        if (onUpdateStats) onUpdateStats();
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể lưu người dùng"));
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Lỗi khi lưu người dùng");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Xóa người dùng thành công!");
        if (onRefresh) onRefresh();
        if (onUpdateStats) onUpdateStats();
      } else {
        alert("Lỗi khi xóa người dùng");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Lỗi khi xóa người dùng");
    }
  };

  const handleUpdateUserRole = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const currentRoles =
      user.roles && Array.isArray(user.roles)
        ? user.roles.map(getRoleCode)
        : ["CUSTOMER"];
    const availableRoles = ["ADMIN", "CUSTOMER", "STAFF"];

    const roleInput = prompt(
      `Cập nhật vai trò cho ${
        user.username
      }\n\nVai trò hiện tại: ${currentRoles.join(
        ", "
      )}\n\nVai trò khả dụng: ${availableRoles.join(
        ", "
      )}\n\nNhập vai trò mới (phân cách bằng dấu phẩy):`,
      currentRoles.join(", ")
    );

    if (roleInput === null) return;

    const newRoles = roleInput
      .split(",")
      .map((r) => r.trim().toUpperCase())
      .filter((r) => availableRoles.includes(r));

    if (newRoles.length === 0) {
      alert("Vui lòng nhập ít nhất một vai trò hợp lệ!");
      return;
    }

    // Call API to update user roles
    try {
      const response = await fetch(
        `http://localhost:8080/users/${userId}/roles`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roles: newRoles }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Cập nhật vai trò thành công!");
        if (onRefresh) onRefresh();
      } else {
        alert("Lỗi: " + (data.message || "Không thể cập nhật vai trò"));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Lỗi khi cập nhật vai trò");
    }
  };

  return (
    <>
      <div className="flex-w flex-sb-m p-b-30">
        <h2 className="mtext-109 cl2">Quản lý người dùng</h2>
        <div className="flex-w" style={{ gap: "10px" }}>
          <button
            onClick={handleCreateUser}
            className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            <i className="fa fa-plus"></i>
            Thêm người dùng
          </button>
          <button
            onClick={onRefresh}
            className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a6268")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c757d")}
          >
            <i className="fa fa-refresh"></i>
            Làm mới
          </button>
        </div>
      </div>

      <div className="bor10 bg-white">
        <div className="table-responsive">
          <table className="table">
            <thead className="bg-light">
              <tr>
                <th className="stext-111 cl6 p-lr-15 p-tb-15">ID</th>
                <th className="stext-111 cl6">Tên đăng nhập</th>
                <th className="stext-111 cl6">Họ tên</th>
                <th className="stext-111 cl6">Email</th>
                <th className="stext-111 cl6">Số điện thoại</th>
                <th className="stext-111 cl6">Vai trò</th>
                <th className="stext-111 cl6">Trạng thái</th>
                <th className="stext-111 cl6">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-tb-30">
                    <p className="stext-111 cl6">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="stext-110 cl2 p-lr-15 p-tb-15">
                      #{user.id}
                    </td>
                    <td className="stext-110 cl2">{user.username}</td>
                    <td className="stext-111 cl6">{user.fullName || "-"}</td>
                    <td className="stext-111 cl6">{user.email}</td>
                    <td className="stext-111 cl6">{user.phone || "-"}</td>
                    <td>
                      {user.roles &&
                      Array.isArray(user.roles) &&
                      user.roles.length > 0 ? (
                        user.roles.map((role, idx) => {
                          // Handle role as object with code/name or as string
                          const roleCode =
                            typeof role === "string"
                              ? role
                              : role?.code || role?.name || "CUSTOMER";
                          return (
                            <span key={idx} className="badge badge-info m-r-5">
                              {roleCode}
                            </span>
                          );
                        })
                      ) : (
                        <span className="badge badge-secondary">CUSTOMER</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.enabled ? "badge-success" : "badge-danger"
                        }`}
                      >
                        {user.enabled ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="stext-111 text-primary m-r-10"
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        title="Sửa"
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleUpdateUserRole(user.id)}
                        className="stext-111 text-info m-r-10"
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        title="Phân quyền"
                      >
                        <i className="fa fa-key"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="stext-111 text-danger"
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        title="Xóa"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <div
            className="modal-dialog"
            style={{
              maxWidth: "500px",
              margin: "30px auto",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowUserModal(false)}
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div
                className="modal-body"
                style={{ maxHeight: "calc(90vh - 150px)", overflowY: "auto" }}
              >
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Tên đăng nhập *</label>
                  <input
                    type="text"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={userForm.username}
                    onChange={(e) =>
                      setUserForm({ ...userForm, username: e.target.value })
                    }
                    placeholder="Tên đăng nhập"
                    disabled={editingUser !== null}
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={userForm.fullName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, fullName: e.target.value })
                    }
                    placeholder="Họ và tên"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Email *</label>
                  <input
                    type="email"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({ ...userForm, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={userForm.phone}
                    onChange={(e) =>
                      setUserForm({ ...userForm, phone: e.target.value })
                    }
                    placeholder="Số điện thoại"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={userForm.address}
                    onChange={(e) =>
                      setUserForm({ ...userForm, address: e.target.value })
                    }
                    placeholder="Địa chỉ"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Trạng thái</label>
                  <select
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={userForm.enabled ? "true" : "false"}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        enabled: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Vô hiệu hóa</option>
                  </select>
                </div>
                {!editingUser && (
                  <div
                    className="alert alert-info"
                    style={{ padding: "10px", marginTop: "10px" }}
                  >
                    <small>
                      Lưu ý: Mật khẩu mặc định sẽ là "12345678". Người dùng cần
                      reset mật khẩu khi đăng nhập lần đầu.
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUserModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveUser}
                >
                  {editingUser ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCRUD;
