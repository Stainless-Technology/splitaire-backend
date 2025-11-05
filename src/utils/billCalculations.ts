import { IParticipant, IBillItem, SplitMethod, ICustomSplit } from '../types';

/**
 * Calculate equal split amounts for all participants
 */
export const calculateEqualSplit = (
  totalAmount: number,
  participants: Array<{ name: string; email: string }>
): IParticipant[] => {
  const amountPerPerson = totalAmount / participants.length;

  return participants.map((p) => ({
    name: p.name,
    email: p.email,
    amountOwed: Math.round(amountPerPerson * 100) / 100, // Round to 2 decimal places
    isPaid: false,
  }));
};

/**
 * Calculate percentage-based split
 */
export const calculatePercentageSplit = (
  totalAmount: number,
  participants: Array<{ name: string; email: string }>,
  customSplits: ICustomSplit[]
): IParticipant[] => {
  // Validate that percentages add up to 100
  const totalPercentage = customSplits.reduce(
    (sum, split) => sum + (split.percentage || 0),
    0
  );

  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(
      `Percentages must add up to 100%. Current total: ${totalPercentage}%`
    );
  }

  return participants.map((p) => {
    const split = customSplits.find((s) => s.participantEmail === p.email);
    const percentage = split?.percentage || 0;
    const amountOwed = (totalAmount * percentage) / 100;

    return {
      name: p.name,
      email: p.email,
      amountOwed: Math.round(amountOwed * 100) / 100,
      isPaid: false,
    };
  });
};

/**
 * Calculate custom amount split
 */
export const calculateCustomSplit = (
  totalAmount: number,
  participants: Array<{ name: string; email: string }>,
  customSplits: ICustomSplit[]
): IParticipant[] => {
  // Validate that custom amounts add up to total
  const totalCustomAmount = customSplits.reduce(
    (sum, split) => sum + (split.amount || 0),
    0
  );

  if (Math.abs(totalCustomAmount - totalAmount) > 0.01) {
    throw new Error(
      `Custom amounts must add up to total amount. Expected: ${totalAmount}, Got: ${totalCustomAmount}`
    );
  }

  return participants.map((p) => {
    const split = customSplits.find((s) => s.participantEmail === p.email);
    const amountOwed = split?.amount || 0;

    return {
      name: p.name,
      email: p.email,
      amountOwed: Math.round(amountOwed * 100) / 100,
      isPaid: false,
    };
  });
};

/**
 * Calculate item-based split
 */
export const calculateItemBasedSplit = (
  participants: Array<{ name: string; email: string }>,
  items: IBillItem[]
): IParticipant[] => {
  const participantMap = new Map<string, number>();

  // Initialize all participants with 0
  participants.forEach((p) => {
    participantMap.set(p.email, 0);
  });

  // Calculate amount owed for each participant based on items
  items.forEach((item) => {
    const splitCount = item.splitBetween.length;
    const amountPerPerson = item.amount / splitCount;

    item.splitBetween.forEach((participantIdentifier) => {
      // Find participant by email or name
      const participant = participants.find(
        (p) =>
          p.email === participantIdentifier.toLowerCase() ||
          p.name.toLowerCase() === participantIdentifier.toLowerCase()
      );

      if (participant) {
        const currentAmount = participantMap.get(participant.email) || 0;
        participantMap.set(participant.email, currentAmount + amountPerPerson);
      }
    });
  });

  return participants.map((p) => ({
    name: p.name,
    email: p.email,
    amountOwed: Math.round((participantMap.get(p.email) || 0) * 100) / 100,
    isPaid: false,
  }));
};

/**
 * Main function to calculate split amounts based on method
 */
export const calculateSplitAmounts = (
  totalAmount: number,
  participants: Array<{ name: string; email: string }>,
  splitMethod: SplitMethod,
  customSplits?: ICustomSplit[],
  items?: IBillItem[]
): IParticipant[] => {
  switch (splitMethod) {
    case SplitMethod.EQUAL:
      return calculateEqualSplit(totalAmount, participants);

    case SplitMethod.PERCENTAGE:
      if (!customSplits || customSplits.length === 0) {
        throw new Error('Custom splits with percentages are required for percentage split method');
      }
      return calculatePercentageSplit(totalAmount, participants, customSplits);

    case SplitMethod.CUSTOM:
      if (!customSplits || customSplits.length === 0) {
        throw new Error('Custom splits with amounts are required for custom split method');
      }
      return calculateCustomSplit(totalAmount, participants, customSplits);

    case SplitMethod.ITEM_BASED:
      if (!items || items.length === 0) {
        throw new Error('Items are required for item-based split method');
      }
      return calculateItemBasedSplit(participants, items);

    default:
      throw new Error(`Unknown split method: ${splitMethod}`);
  }
};

/**
 * Validate that all participants in items exist in the participants list
 */
export const validateItemParticipants = (
  participants: Array<{ name: string; email: string }>,
  items: IBillItem[]
): { valid: boolean; error?: string } => {
  const participantIdentifiers = new Set(
    participants.flatMap((p) => [p.email.toLowerCase(), p.name.toLowerCase()])
  );

  for (const item of items) {
    for (const splitPerson of item.splitBetween) {
      if (!participantIdentifiers.has(splitPerson.toLowerCase())) {
        return {
          valid: false,
          error: `Participant "${splitPerson}" in item "${item.description}" is not in the participants list`,
        };
      }
    }

    if (!participantIdentifiers.has(item.paidBy.toLowerCase())) {
      return {
        valid: false,
        error: `Payer "${item.paidBy}" in item "${item.description}" is not in the participants list`,
      };
    }
  }

  return { valid: true };
};

/**
 * Calculate total from items
 */
export const calculateTotalFromItems = (items: IBillItem[]): number => {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return Math.round(total * 100) / 100;
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
