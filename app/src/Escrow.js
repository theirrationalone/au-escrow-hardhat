export default function Escrow({ address, arbiter, beneficiary, value, handleApprove }) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div className="list-label arbiter_label">
            <div className="list-label_arbiter-user"></div>
            <div className="list-label_arbiter-user--body"></div>
          </div>
          <div className="list-label_user-text">
            {" "}
            {arbiter} <span style={{ fontWeight: "bold", color: "#aaa" }}>Arbiter</span>{" "}
          </div>
        </li>
        <li>
          <div className="list-label beneficiary_label">
            <div className="list-label_beneficiary-user"></div>
            <div className="list-label_beneficiary-user--body"></div>
          </div>
          <div className="list-label_user-text">
            {" "}
            {beneficiary} <span style={{ fontWeight: "bold", color: "#aaa" }}>Beneficiary</span>{" "}
          </div>
        </li>
        <li>
          <div className="list-label-eth"> Value </div>
          <div className="list-label_user-text">
            {value} ({parseFloat(+value / 1e18).toFixed(2)}{" "}
            <span style={{ fontWeight: "bolder", color: "#aaa" }}>ETH) </span>
          </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
