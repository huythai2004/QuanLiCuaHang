
import closeIcon from "../images/icons/icon-close2.png";

function Search({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-search-header flex-c-m trans-04 js-hide-modal-search" style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 9999
    }}>
      <div className="container-search-header" style={{
        background: "#fff",
        borderRadius: 8,
        padding: 32,
        minWidth: 320,
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)"
      }}>
        <button
          className="flex-c-m btn-hide-modal-search trans-04 js-hide-modal-search"
          style={{ border: "none", background: "transparent", position: "absolute", top: 16, right: 16 }}
          onClick={onClose}
        >
          <img src={closeIcon} alt="CLOSE" />
        </button>
        <form className="wrap-search-header flex-w p-l-15" onSubmit={e => e.preventDefault()}>
          <button className="flex-c-m trans-04" style={{ border: "none", background: "transparent" }}>
            <i className="zmdi zmdi-search"></i>
          </button>
          <input
            className="plh3"
            type="text"
            name="search"
            placeholder="Search..."
            style={{ marginLeft: 8, flex: 1, border: "none", outline: "none" }}
          />
        </form>
      </div>
    </div>
  );
}

export default Search;