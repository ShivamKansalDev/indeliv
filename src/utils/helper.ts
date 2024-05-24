import {  TOKEN_STORAGE, } from './constants';


export function userToken(): string | null{
  return localStorage.getItem(TOKEN_STORAGE);
}

export function isLoggedIn(): boolean {
  return userToken() !== null;
}

export function logout() {
  localStorage.removeItem(TOKEN_STORAGE);
}

export function inputHandleChange<T>(e: React.ChangeEvent<HTMLInputElement>, data: T, setData: (value: React.SetStateAction<T>) => void) {
  e.preventDefault();
  setData({
    ...data,
    [e.target.name]: e.target.value,
  });
};

export const numberWithCommas = (numberString: any) => {
  const number = parseFloat(String(numberString)?.replace(/,/g, ''))||0;
  if (isNaN(number)) {
    return 'Invalid Number';
  }
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };
export function formatTime(datetime: string) {
  // console.log(datetime);
  const date = new Date(datetime);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const period = hours < 12 ? 'AM' : 'PM';
// console.log(`${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`)
  return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
}