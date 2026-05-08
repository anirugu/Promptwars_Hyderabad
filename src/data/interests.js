// Interest categories used for recommendations and filtering.
export const INTERESTS = [
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'culture', label: 'Culture & History', emoji: '🏛️' },
  { id: 'food', label: 'Food & Drink', emoji: '🍜' },
  { id: 'nature', label: 'Nature & Wildlife', emoji: '🌿' },
  { id: 'beach', label: 'Beach & Water', emoji: '🏝️' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'family', label: 'Family Friendly', emoji: '👨‍👩‍👧' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'photography', label: 'Photography', emoji: '📸' }
];

export const getInterest = (id) => INTERESTS.find((i) => i.id === id);
