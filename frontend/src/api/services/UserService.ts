/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get Users
     * @returns User Successful Response
     * @throws ApiError
     */
    public static getUsers(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/',
        });
    }
    /**
     * Get User
     * @param email
     * @returns User Successful Response
     * @throws ApiError
     */
    public static getUser(
        email: string,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/{email}',
            path: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param email
     * @returns void
     * @throws ApiError
     */
    public static deleteUser(
        email: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/{email}',
            path: {
                'email': email,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create User
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createUser(
        requestBody: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateUser(
        requestBody: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/{email}/update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assign Worker
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static assignWorker(
        requestBody: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/assign-worker',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Start Server
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static startServer(
        requestBody: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/start-server',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
