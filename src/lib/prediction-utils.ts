export function getTimeRemaining(endDate?: Date | string): string | null {
  if (!endDate) return null;
  
  // Convertir en Date si c'est une string
  const end = new Date(endDate);
  
  // Vérifier si la date est valide
  if (isNaN(end.getTime())) return null;
  
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Fermé';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}j ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(new Date(date));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

export function getTodayStart(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getTodayEnd(): Date {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

export function isVotingOpen(prediction: {
  voting_open: boolean;
  voting_closes_at?: Date | string | null;
}): boolean {
  if (!prediction.voting_open) return false;
  
  if (prediction.voting_closes_at) {
    const endDate = new Date(prediction.voting_closes_at);
    return new Date() < endDate;
  }
  
  return true;
}
