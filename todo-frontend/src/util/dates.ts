export function formatUpdatedAt(updatedAt: Date): string {
    const now = new Date();
    const updatedDate = new Date(updatedAt);
    const diffInSeconds = Math.floor((now.getTime() - updatedDate.getTime()) / 1000);
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diffInSeconds < minute) {
        return 'Just now';
    } else if (diffInSeconds < hour) {
        return `${Math.floor(diffInSeconds / minute)}m`;
    } else if (diffInSeconds < day) {
        return `${Math.floor(diffInSeconds / hour)}h`;
    } else if (diffInSeconds < week) {
        return `${Math.floor(diffInSeconds / day)}d`;
    } else if (diffInSeconds < month) {
        return `${Math.floor(diffInSeconds / week)}w`;
    } else if (diffInSeconds < year) {
        return `${Math.floor(diffInSeconds / month)}mo`;
    } else {
        return `${Math.floor(diffInSeconds / year)}y`;
    }
}