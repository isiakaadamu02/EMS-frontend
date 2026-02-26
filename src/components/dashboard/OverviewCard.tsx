import type { SummaryCardProps } from "../../interface"



const OverviewCard = ({icon, text, number, color}: SummaryCardProps) => {
    return (
        <div className="rounded flex bg-white">
            <div className={`text-3xl flex justify-center items-center ${color} text-white px-4`}>{icon}</div>

            <div className="p-4 py-1">
                <p className="text-lg font-semibold">{text}</p>
                <p className="text-xl font-bold">{number}</p>
            </div>
        </div>
    )
}

export default OverviewCard