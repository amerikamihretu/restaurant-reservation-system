// Convert "HH:MM" to total minutes from midnight
const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};
// Convert total minutes from midnight to "HH:MM"
const formatMinutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
/**
 * Generates uniform time slots between opening and closing times.
 * @param openTime - Opening time in "HH:MM"
 * @param closeTime - Closing time in "HH:MM"
 * @param durationMinutes - Slot duration in minutes (default 90 mins)
 * @param intervalMinutes - Interval step between slots (default 30 mins)
 */
export const generateDailyTimeSlots = (openTime, closeTime, durationMinutes = 90, intervalMinutes = 30) => {
    const openMins = parseTimeToMinutes(openTime);
    const closeMins = parseTimeToMinutes(closeTime);
    const slots = [];
    let currentStart = openMins;
    while (currentStart + durationMinutes <= closeMins) {
        const currentEnd = currentStart + durationMinutes;
        slots.push({
            startTime: formatMinutesToTime(currentStart),
            endTime: formatMinutesToTime(currentEnd),
        });
        currentStart += intervalMinutes;
    }
    return slots;
};
