import "../../css/main.css";
import "../../css/util.css";
import "../../vendor/bootstrap/css/bootstrap.min.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import React, { useState, useEffect } from "react";

export default function AdminFeedback() {
  const [message, setMessage] = useState([]);
  
  const fetchMessages = () => {
    fetch("http://localhost:8080/contact/messages")
      .then((res) => res.json())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching messages:", err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8080/contact/mark-read/${id}`, {
        method: "PUT",
      });
      // Refresh the list after marking as read
      fetchMessages();
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  return (
    <>
      <div className="flex-w flex-sb-m p-b-30">
        <h2 className="mtext-109 cl2">Customer Feedback</h2>
        <div className="flex-w" style={{ gap: "10px" }}>
          <button
            onClick={fetchMessages}
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
                <th className="stext-111 cl6">Full Name</th>
                <th className="stext-111 cl6">Email</th>
                <th className="stext-111 cl6">Subject</th>
                <th className="stext-111 cl6">Message</th>
                <th className="stext-111 cl6">Sent At</th>
                <th className="stext-111 cl6">Status</th>
                <th className="stext-111 cl6">Action</th>
              </tr>
            </thead>
            <tbody>
              {message.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-tb-30">
                    <p className="stext-111 cl6">Không có tin nhắn nào</p>
                  </td>
                </tr>
              ) : (
                message.map((msg) => (
                  <tr key={msg.id}>
                    <td className="stext-110 cl2 p-lr-15 p-tb-15">
                      #{msg.id}
                    </td>
                    <td className="stext-110 cl2">{msg.fullName}</td>
                    <td className="stext-110 cl2">{msg.email}</td>
                    <td className="stext-110 cl2">{msg.subject}</td>
                    <td
                      className="stext-111 cl6"
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {msg.message}
                    </td>
                    <td className="stext-111 cl6">
                      {msg.sentAt
                        ? new Date(msg.sentAt).toLocaleString("vi-VN")
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          msg.status === "READ"
                            ? "bg-secondary"
                            : "bg-success"
                        }`}
                      >
                        {msg.status || "UNREAD"}
                      </span>
                    </td>
                    <td>
                      {msg.status !== "READ" && (
                        <button
                          className="stext-111 text-primary"
                          onClick={() => markAsRead(msg.id)}
                          style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                          }}
                          title="Đánh dấu đã đọc"
                        >
                          <i className="fa fa-check m-r-5"></i>
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
