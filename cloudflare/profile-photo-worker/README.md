# IEEE NMAMIT profile photo Worker

This Worker is the private API between the React profile page and the R2 photo bucket. It accepts only Firebase-authenticated requests for the signed-in user's own photo. The R2 key is derived from the verified Firebase `sub`; the client never chooses a UID or object key.

## Local development

1. Install the dependencies in this directory with `npm install`.
2. From this directory, run `npm run dev` to start the Worker at `http://localhost:8787`.
3. In the website root, set `VITE_PROFILE_PHOTO_API_URL=http://localhost:8787` in your ignored `.env.local` file.
4. Start the Vite app at `http://localhost:5173` and sign in with an `@nmamit.in` Firebase account.

By default, Wrangler uses a local R2 simulation for `npm run dev`; uploads do not go to the Cloudflare bucket. Remove `.env.local` or clear the variable to disable the photo service in the website.

## Test account deployment

The `wrangler.jsonc` file is configured for the test Worker `profilephototesting`, the test bucket `profile-photos-test`, and the local Vite origin. `npm run deploy` publishes to Cloudflare and updates that Worker. Do not run it unless you intend to deploy to the signed-in Cloudflare account. For production, use a separate club-owned Cloudflare account, bucket, Worker configuration, and approved website origin.

The bucket binding is private: this Worker does not enable the R2 public URL. The API requires a Firebase ID token and validates its RS256 signature, issuer, audience, expiry, issue time, authentication time, and subject. It also checks the college email domain enforced by the existing profile screen. Firebase's standard ID-token verification does not check token revocation unless a separate revocation check is implemented.

Uploads are limited to 1 MiB and structurally checked for 512 × 512 WebP. The browser center-crops and encodes the chosen image; the Worker repeats the size, container, and dimension checks. Reads return private, non-cacheable image bytes. CORS is restricted to the origins in `ALLOWED_ORIGINS`.

The client saves `{ key, contentType, version }` under `users/{uid}.profilePhoto`. Confirm your deployed Firestore Rules allow a signed-in user to update only their own photo metadata without granting access to another user's profile. This repository does not include a Firestore Rules file, so no remote Firebase rules are changed here.
