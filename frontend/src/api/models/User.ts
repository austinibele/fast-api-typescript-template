/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    name: string;
    phone_number: string;
    purchase_date: string;
    email: string;
    created_at: string;
    last_modified: string;
    queue_position: User.queue_position;
    should_rebook?: boolean;
};
export namespace User {
    export enum queue_position {
        WAITING = 'waiting',
        IN_PROGRESS = 'in_progress',
        FINISHED = 'finished',
    }
}

