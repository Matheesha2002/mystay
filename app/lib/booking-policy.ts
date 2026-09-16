export function todayInSriLanka() {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const value = (type: string) =>
        parts.find((part) => part.type === type)!.value;

    return `${value("year")}-${value("month")}-${value("day")}`;
}

export function canCancelBooking(
    status: string,
    checkIn: Date,
    today: string
) {
    return (
        (status === "PENDING" || status === "CONFIRMED") &&
        checkIn.toISOString().slice(0, 10) > today
    );
}