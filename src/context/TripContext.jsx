import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { getExperience } from '../data/experiences.js';
import { getDestination } from '../data/destinations.js';

const TripContext = createContext(null);

const emptyDraft = () => ({
  id: null,
  name: '',
  destinationId: null,
  startDate: '',
  days: 3,
  itinerary: { 1: [], 2: [], 3: [] },
  notes: '',
  travellers: 2
});

const buildItinerary = (days, prev = {}) => {
  const next = {};
  for (let d = 1; d <= days; d += 1) {
    next[d] = prev[d] ? [...prev[d]] : [];
  }
  return next;
};

const newId = () => `trip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function TripProvider({ children }) {
  const [interests, setInterests] = useLocalStorage('wf:interests', []);
  const [draft, setDraft] = useLocalStorage('wf:draft', emptyDraft());
  const [savedTrips, setSavedTrips] = useLocalStorage('wf:trips', []);

  const toggleInterest = useCallback(
    (id) => {
      setInterests((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    },
    [setInterests]
  );

  const clearInterests = useCallback(() => setInterests([]), [setInterests]);

  /* ------------------------------------------------------------------ */
  /*  Draft trip operations                                              */
  /* ------------------------------------------------------------------ */
  const startNewTrip = useCallback(
    (destinationId) => {
      const dest = destinationId ? getDestination(destinationId) : null;
      const draftTrip = {
        ...emptyDraft(),
        destinationId: destinationId ?? null,
        name: dest ? `${dest.name} adventure` : 'My new trip'
      };
      setDraft(draftTrip);
      return draftTrip;
    },
    [setDraft]
  );

  const updateDraft = useCallback(
    (patch) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch };
        if (patch.days != null && patch.days !== prev.days) {
          next.itinerary = buildItinerary(patch.days, prev.itinerary);
        }
        return next;
      });
    },
    [setDraft]
  );

  const addExperienceToDay = useCallback(
    (day, experienceId) => {
      setDraft((prev) => {
        const itinerary = { ...prev.itinerary };
        const list = itinerary[day] ? [...itinerary[day]] : [];
        if (!list.includes(experienceId)) list.push(experienceId);
        itinerary[day] = list;
        return { ...prev, itinerary };
      });
    },
    [setDraft]
  );

  const removeExperienceFromDay = useCallback(
    (day, experienceId) => {
      setDraft((prev) => {
        const itinerary = { ...prev.itinerary };
        itinerary[day] = (itinerary[day] ?? []).filter((id) => id !== experienceId);
        return { ...prev, itinerary };
      });
    },
    [setDraft]
  );

  const moveExperience = useCallback(
    (fromDay, toDay, experienceId) => {
      if (fromDay === toDay) return;
      setDraft((prev) => {
        const itinerary = { ...prev.itinerary };
        itinerary[fromDay] = (itinerary[fromDay] ?? []).filter((id) => id !== experienceId);
        const target = itinerary[toDay] ? [...itinerary[toDay]] : [];
        if (!target.includes(experienceId)) target.push(experienceId);
        itinerary[toDay] = target;
        return { ...prev, itinerary };
      });
    },
    [setDraft]
  );

  /* ------------------------------------------------------------------ */
  /*  Saved trips                                                        */
  /* ------------------------------------------------------------------ */
  const saveDraftAsTrip = useCallback(() => {
    const id = draft.id ?? newId();
    const trip = { ...draft, id, savedAt: Date.now() };
    setSavedTrips((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return [trip, ...prev];
      const next = [...prev];
      next[idx] = trip;
      return next;
    });
    setDraft({ ...trip });
    return trip;
  }, [draft, setDraft, setSavedTrips]);

  const loadTripIntoDraft = useCallback(
    (id) => {
      const trip = savedTrips.find((t) => t.id === id);
      if (!trip) return null;
      setDraft({ ...trip });
      return trip;
    },
    [savedTrips, setDraft]
  );

  const deleteTrip = useCallback(
    (id) => {
      setSavedTrips((prev) => prev.filter((t) => t.id !== id));
      setDraft((prev) => (prev.id === id ? emptyDraft() : prev));
    },
    [setDraft, setSavedTrips]
  );

  const clearDraft = useCallback(() => setDraft(emptyDraft()), [setDraft]);

  /* ------------------------------------------------------------------ */
  /*  Derived values                                                     */
  /* ------------------------------------------------------------------ */
  const draftStats = useMemo(() => {
    const ids = Object.values(draft.itinerary ?? {}).flat();
    const experiences = ids.map(getExperience).filter(Boolean);
    const totalCost = experiences.reduce((sum, e) => sum + e.cost, 0);
    const totalHours = experiences.reduce((sum, e) => sum + e.duration, 0);
    return {
      experienceCount: experiences.length,
      totalCost,
      totalHours,
      perTraveller: draft.travellers > 0 ? totalCost / draft.travellers : totalCost
    };
  }, [draft]);

  const value = useMemo(
    () => ({
      interests,
      toggleInterest,
      clearInterests,
      draft,
      updateDraft,
      startNewTrip,
      addExperienceToDay,
      removeExperienceFromDay,
      moveExperience,
      saveDraftAsTrip,
      loadTripIntoDraft,
      deleteTrip,
      clearDraft,
      savedTrips,
      draftStats
    }),
    [
      interests,
      toggleInterest,
      clearInterests,
      draft,
      updateDraft,
      startNewTrip,
      addExperienceToDay,
      removeExperienceFromDay,
      moveExperience,
      saveDraftAsTrip,
      loadTripIntoDraft,
      deleteTrip,
      clearDraft,
      savedTrips,
      draftStats
    ]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within a TripProvider');
  return ctx;
}
