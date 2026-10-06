export type CommissionItem = {
  unit: "work" | "materials";
  quantity: number;
  price: number;
};

const roundToCents = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const calculateWorkTotal = (items: CommissionItem[]): number =>
  roundToCents(
    items
      .filter((item) => item.unit === "work")
      .reduce((sum, item) => sum + item.quantity * item.price, 0)
  );

export const calculateCommission = (
  workTotal: number,
  rate: number
): number => roundToCents((workTotal * rate) / 100);

export const calculateWorkerCommission = (
  items: CommissionItem[],
  rate: number
): number => calculateCommission(calculateWorkTotal(items), rate);

export const sumWorkerRates = (rates: number[]): number =>
  roundToCents(rates.reduce((sum, rate) => sum + rate, 0));

export const validateWorkerRateSum = (rates: number[]): boolean =>
  sumWorkerRates(rates) <= 100;
