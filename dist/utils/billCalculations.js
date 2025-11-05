"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = exports.calculateTotalFromItems = exports.validateItemParticipants = exports.calculateSplitAmounts = exports.calculateItemBasedSplit = exports.calculateCustomSplit = exports.calculatePercentageSplit = exports.calculateEqualSplit = void 0;
const types_1 = require("../types");
/**
 * Calculate equal split amounts for all participants
 */
const calculateEqualSplit = (totalAmount, participants) => {
    const amountPerPerson = totalAmount / participants.length;
    return participants.map((p) => ({
        name: p.name,
        email: p.email,
        amountOwed: Math.round(amountPerPerson * 100) / 100, // Round to 2 decimal places
        isPaid: false,
    }));
};
exports.calculateEqualSplit = calculateEqualSplit;
/**
 * Calculate percentage-based split
 */
const calculatePercentageSplit = (totalAmount, participants, customSplits) => {
    // Validate that percentages add up to 100
    const totalPercentage = customSplits.reduce((sum, split) => sum + (split.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new Error(`Percentages must add up to 100%. Current total: ${totalPercentage}%`);
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
exports.calculatePercentageSplit = calculatePercentageSplit;
/**
 * Calculate custom amount split
 */
const calculateCustomSplit = (totalAmount, participants, customSplits) => {
    // Validate that custom amounts add up to total
    const totalCustomAmount = customSplits.reduce((sum, split) => sum + (split.amount || 0), 0);
    if (Math.abs(totalCustomAmount - totalAmount) > 0.01) {
        throw new Error(`Custom amounts must add up to total amount. Expected: ${totalAmount}, Got: ${totalCustomAmount}`);
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
exports.calculateCustomSplit = calculateCustomSplit;
/**
 * Calculate item-based split
 */
const calculateItemBasedSplit = (participants, items) => {
    const participantMap = new Map();
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
            const participant = participants.find((p) => p.email === participantIdentifier.toLowerCase() ||
                p.name.toLowerCase() === participantIdentifier.toLowerCase());
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
exports.calculateItemBasedSplit = calculateItemBasedSplit;
/**
 * Main function to calculate split amounts based on method
 */
const calculateSplitAmounts = (totalAmount, participants, splitMethod, customSplits, items) => {
    switch (splitMethod) {
        case types_1.SplitMethod.EQUAL:
            return (0, exports.calculateEqualSplit)(totalAmount, participants);
        case types_1.SplitMethod.PERCENTAGE:
            if (!customSplits || customSplits.length === 0) {
                throw new Error('Custom splits with percentages are required for percentage split method');
            }
            return (0, exports.calculatePercentageSplit)(totalAmount, participants, customSplits);
        case types_1.SplitMethod.CUSTOM:
            if (!customSplits || customSplits.length === 0) {
                throw new Error('Custom splits with amounts are required for custom split method');
            }
            return (0, exports.calculateCustomSplit)(totalAmount, participants, customSplits);
        case types_1.SplitMethod.ITEM_BASED:
            if (!items || items.length === 0) {
                throw new Error('Items are required for item-based split method');
            }
            return (0, exports.calculateItemBasedSplit)(participants, items);
        default:
            throw new Error(`Unknown split method: ${splitMethod}`);
    }
};
exports.calculateSplitAmounts = calculateSplitAmounts;
/**
 * Validate that all participants in items exist in the participants list
 */
const validateItemParticipants = (participants, items) => {
    const participantIdentifiers = new Set(participants.flatMap((p) => [p.email.toLowerCase(), p.name.toLowerCase()]));
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
exports.validateItemParticipants = validateItemParticipants;
/**
 * Calculate total from items
 */
const calculateTotalFromItems = (items) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    return Math.round(total * 100) / 100;
};
exports.calculateTotalFromItems = calculateTotalFromItems;
/**
 * Format currency amount
 */
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
//# sourceMappingURL=billCalculations.js.map