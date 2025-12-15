import Calendar from "../components/Calendar";

export default function CalendarPage() {
  return (
    // <div className="d-flex flex-column">
    <div className="container">
        <div className="row my-2">
            <div className="col-9">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">All</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">House 1</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">House 2</a>
                    </li>
                </ul>
            </div>    
            <div className="col-3">
                <input type="text" className="form-control" placeholder="search" />
            </div>            
        </div>
        <div className="row">
            <div className="col-9">
                <Calendar />
            </div>
            <div className="col-3">
                <h5>Key bookings</h5>
                {/* add draggable events here */}
            </div>
        </div>
    </div>
  );
}