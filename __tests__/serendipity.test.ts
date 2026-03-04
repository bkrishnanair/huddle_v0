import { getDistanceBetweenPoints } from '@/lib/utils';
// Assuming the Serendipity Filter logic is extracted to a testable function

describe('Serendipity Engine - Fan-out Logic', () => {
    it('should calculate distance correctly between two geocoordinates', () => {
        // College Park, MD
        const loc1 = { lat: 38.9897, lng: -76.9378 };
        // Washington, DC
        const loc2 = { lat: 38.9072, lng: -77.0369 };

        // Test the Haversine calculation
        const distance = getDistanceBetweenPoints(loc1, loc2);
        // Approximate distance should be around ~7.8 miles
        expect(distance).toBeGreaterThan(7.0);
        expect(distance).toBeLessThan(8.5);
    });

    describe('Interest Matching Logic', () => {
        it('should notify follower if follower has no filters set', () => {
            const followerFilters = [];
            const eventCategory = 'Basketball';
            const shouldNotify = followerFilters.length === 0 || followerFilters.includes(eventCategory);
            expect(shouldNotify).toBe(true);
        });

        it('should notify follower if follower explicitly filters for the category', () => {
            const followerFilters = ['Basketball', 'Soccer'];
            const eventCategory = 'Basketball';
            const shouldNotify = followerFilters.length === 0 || followerFilters.includes(eventCategory);
            expect(shouldNotify).toBe(true);
        });

        it('should NOT notify follower if follower filters do not include the category', () => {
            const followerFilters = ['Soccer', 'Tennis'];
            const eventCategory = 'Basketball';
            const shouldNotify = followerFilters.length === 0 || followerFilters.includes(eventCategory);
            expect(shouldNotify).toBe(false);
        });
    });

    describe('Smart Location Debouncing', () => {
        it('should only update backend if distance > 500 meters (~0.31 miles)', () => {
            const userOldLocation = { lat: 38.9897, lng: -76.9378 };

            // Move slightly (0.1 miles)
            const slightMove = { lat: 38.9905, lng: -76.9385 };
            const distanceSlight = getDistanceBetweenPoints(userOldLocation, slightMove);
            const shouldUpdateSlight = distanceSlight > 0.31;
            expect(shouldUpdateSlight).toBe(false);

            // Move significantly (1 mile)
            const largeMove = { lat: 39.0042, lng: -76.9348 };
            const distanceLarge = getDistanceBetweenPoints(userOldLocation, largeMove);
            const shouldUpdateLarge = distanceLarge > 0.31;
            expect(shouldUpdateLarge).toBe(true);
        });
    });
});
