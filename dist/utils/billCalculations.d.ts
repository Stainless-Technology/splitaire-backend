import { IParticipant, IBillItem, SplitMethod, ICustomSplit } from '../types';
/**
 * Calculate equal split amounts for all participants
 */
export declare const calculateEqualSplit: (totalAmount: number, participants: Array<{
    name: string;
    email: string;
}>) => IParticipant[];
/**
 * Calculate percentage-based split
 */
export declare const calculatePercentageSplit: (totalAmount: number, participants: Array<{
    name: string;
    email: string;
}>, customSplits: ICustomSplit[]) => IParticipant[];
/**
 * Calculate custom amount split
 */
export declare const calculateCustomSplit: (totalAmount: number, participants: Array<{
    name: string;
    email: string;
}>, customSplits: ICustomSplit[]) => IParticipant[];
/**
 * Calculate item-based split
 */
export declare const calculateItemBasedSplit: (participants: Array<{
    name: string;
    email: string;
}>, items: IBillItem[]) => IParticipant[];
/**
 * Main function to calculate split amounts based on method
 */
export declare const calculateSplitAmounts: (totalAmount: number, participants: Array<{
    name: string;
    email: string;
}>, splitMethod: SplitMethod, customSplits?: ICustomSplit[], items?: IBillItem[]) => IParticipant[];
/**
 * Validate that all participants in items exist in the participants list
 */
export declare const validateItemParticipants: (participants: Array<{
    name: string;
    email: string;
}>, items: IBillItem[]) => {
    valid: boolean;
    error?: string;
};
/**
 * Calculate total from items
 */
export declare const calculateTotalFromItems: (items: IBillItem[]) => number;
/**
 * Format currency amount
 */
export declare const formatCurrency: (amount: number, currency?: string) => string;
//# sourceMappingURL=billCalculations.d.ts.map