export type PartyActiveStatus = {
  id: number;
  /** Backend Party.active */
  active: boolean;
  /** active && partyDate is today */
  actionable: boolean;
  partyDate: string | null;
  today: string;
  reason: 'OK' | 'PARTY_DEACTIVATED' | 'PARTY_DATE_MISSING' | 'PARTY_DATE_NOT_TODAY' | string;
};
