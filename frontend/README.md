## TODO WHEN API SDK DOESNT WORK

change BASE in /core/OpenAPI.ts to:
'http://localhost:8011'

Change line 54 in core/CancelablePromise.ts to this:
                if (this.#resolve) this.#resolve(value);

OR Upgrade to Next >= 14.0.3

# CMS

This is the CMS component which has an Admin Dashboard and Wraps around the frontend, displaying the frontend in an iframe

