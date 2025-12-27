export default function ChecklistPage() {

    const checklist = [
        "Retaining walls order",
        "Crusher dust",
        "Concrete",
        "Steel/reo",
        "Pods",
        "WC hire",
        "Bolts tie down",
        "Gas fitter rough in",
        "Gas fitter fit off",
        "Phone rough in",
        "Hardware: rough in",
        "Hardware: fit off",
        "Hardware: FC",
        "Hardware: sink",
        "Hardware: PC",
        "Hardware: steel lintels",
        "Bricks",
        "Lights",
        "Water tank and pump",
        "Tile order",
        "Turf",
        "Landscaping",
        "Disconnect power",
        "Gas connection",
        "Oven",
        "Cooktop",
        "White goods",
        "Book gas fitter",
        "Hand over folder",
        "NBN connection",
        "Covenant bond refund"
    ];


    return (
        <div className="container-fluid d-flex flex-column vh-100 pe-4" style={{ minHeight: 0 }}>
            <h4>Order checklist</h4>
            <ul className="list-group overflow-auto flex-grow-1" style={{ minHeight: 0 }}>
                {checklist.map((item, i) => (
                    <li key={`check-${i}`} className='list-group-item position-relative'>
                        <input className="form-check-input me-2" type="checkbox" value="" id={`check-${i}`} />
                        <label className="form-check-label" htmlFor={`check-${i}`}>{item}</label>
                        <label
                            htmlFor={`check-${i}`}
                            className="stretched-link"
                            style={{ cursor: "pointer" }}
                        />
                    </li>
                ))}
            </ul>
        </div>

    );
}