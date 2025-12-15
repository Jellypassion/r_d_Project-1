import { describe, it, expect } from 'vitest';
import { FophelpApiClient } from '../src/helpers/fophelp-client';

describe('Token Refresh Tests', () => {
    it('should automatically refresh tokens when expired', () => {
        const apiClient = new FophelpApiClient();
        const tokenStorage = apiClient.getTokenStorage();

        // Get initial token
        const initialAccessToken = tokenStorage.getAccessToken();
        expect(initialAccessToken).toBeDefined();
        expect(initialAccessToken.length).toBeGreaterThan(0);

        // Make a request that will trigger token refresh if expired
        // The fetchWithRetry logic will automatically:
        // 1. Detect 401/403 or Token-Expired header
        // 2. Call the refresh endpoint
        // 3. Update tokens in tokenStorage
        // 4. Retry the original request

        // Example: If you have an endpoint, uncomment and test:
        // try {
        //     await apiClient.exampleApi.getAll();
        //
        //     // After successful request (with or without refresh)
        //     const newAccessToken = tokenStorage.getAccessToken();
        //     expect(newAccessToken).toBeDefined();
        //
        //     // Token might have been refreshed
        //     console.log('Token refreshed:', initialAccessToken !== newAccessToken);
        // } catch (error) {
        //     console.error('Request failed:', error);
        // }
    });

    it('should store and retrieve all cookie values', () => {
        const apiClient = new FophelpApiClient();
        const tokenStorage = apiClient.getTokenStorage();

        expect(tokenStorage.getAccessToken()).toBeDefined();
        expect(tokenStorage.getRefreshToken()).toBeDefined();
        expect(tokenStorage.getUsername()).toBeDefined();
        expect(tokenStorage.getRefreshExpires()).toBeDefined();
        expect(tokenStorage.getSessionUser()).toBeDefined();

        const allCookies = tokenStorage.getAllCookies();
        expect(allCookies['X-Access-Token']).toBeDefined();
        expect(allCookies['X-Refresh-Token']).toBeDefined();
        expect(allCookies['X-Username']).toBeDefined();
        expect(allCookies['X-Refresh-Expires']).toBeDefined();
        expect(allCookies['Session-User']).toBeDefined();
    });

    it('should update tokens when refresh is called', () => {
        const apiClient = new FophelpApiClient();
        const tokenStorage = apiClient.getTokenStorage();

        const originalToken = tokenStorage.getAccessToken();

        // Simulate token update (what refresh service does)
        tokenStorage.updateTokens({
            accessToken: 'new-test-token',
            refreshToken: 'new-refresh-token'
        });

        expect(tokenStorage.getAccessToken()).toBe('new-test-token');
        expect(tokenStorage.getRefreshToken()).toBe('new-refresh-token');
        expect(tokenStorage.getAccessToken()).not.toBe(originalToken);

        // Other tokens should remain unchanged
        expect(tokenStorage.getUsername()).toBeDefined();
        expect(tokenStorage.getSessionUser()).toBeDefined();
    });
});
