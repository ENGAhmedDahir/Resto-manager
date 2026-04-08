export function getDateRange(period) {
  const now = new Date();

  switch (period) {
    case "today": {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    case "thisWeek": {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return { start, end: new Date() };
    }

    case "thisMonth": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end: new Date() };
    }

    case "thisYear": {
      const start = new Date(now.getFullYear(), 0, 1);
      return { start, end: new Date() };
    }

    default:
      throw new Error("Invalid period");
  }
}
