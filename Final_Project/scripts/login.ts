#!/usr/bin/env node

/**
 * Login script - authenticates and updates .env file with new tokens
 *
 * Usage:
 *   npm run login
 *   OR
 *   node scripts/login.js
 */

import { FophelpApiClient } from '../src/helpers/fophelp-client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
    console.log('🔐 Starting login process...\n');

    try {
        // Initialize API client
        const apiClient = new FophelpApiClient();

        // Check credentials
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;

        if (!username || !password) {
            console.error('❌ Error: API_USERNAME and API_PASSWORD must be set in .env file');
            process.exit(1);
        }

        console.log(`📧 Username: ${username}`);
        console.log('🔑 Attempting login...\n');

        // Login and update .env
        const tokens = await apiClient.authApi.loginAndUpdateEnv(username, password);

        console.log('✅ Login successful!\n');
        console.log('📝 Tokens received and saved to .env file:');
        console.log('─'.repeat(60));
        console.log(`Access Token:    ${tokens.accessToken.substring(0, 50)}...`);
        console.log(`Refresh Token:   ${tokens.refreshToken}`);
        console.log(`Username:        ${tokens.username}`);
        console.log(`Session User:    ${tokens.sessionUser}`);
        console.log(`Refresh Expires: ${tokens.refreshExpires}`);
        console.log('─'.repeat(60));
        console.log('\n✨ .env file has been updated with new authentication tokens');

    } catch (error) {
        console.error('\n❌ Login failed:', error);
        process.exit(1);
    }
}

// Run the script
main();
