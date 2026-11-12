import { RESULTS, MULTIPLIERS } from "./data";

export const validateBet = (bet, score) => {
  const numBet = Number(bet);
  if (isNaN(numBet) || numBet % 100 !== 0 || numBet < 100 || numBet > 500 || numBet > score) {
    return "Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có";
  }
  return "";
};

export const calcChange = (bet, level, correct, hasInsurance) => {
  if (correct) return bet * MULTIPLIERS[level];
  if (hasInsurance) return 0;
  return -bet;
};

export const getResult = (score) => {
  return RESULTS.find(r => score >= r.min) || RESULTS[RESULTS.length - 1];
};