# Hostinger upload API

The repository API source is a safe reference implementation for `public_html/website/api/`. Do not overwrite an already-working Hostinger API without comparing its authentication and deployment configuration first. The existing `public_html/website/logo`, `qr-code`, and `google-play` folders must be siblings of `api`.

Before deployment, edit `PUBLIC_BASE_URL` and `ALLOWED_ORIGINS` in the PHP file. Add the final admin-panel origin to the allowlist. Do not use `*` for production CORS. Confirm PHP has the Fileinfo extension enabled.

The API accepts only `POST multipart/form-data` with `file` and one controlled `type`: `logo`, `qr-code`, or `google-play`. It validates the Firebase ID token, the configured admin UID, MIME, extension, and 5 MB size, generates a random filename, and never exposes filesystem paths. Successful uploads return `publicUrl`. It has not been tested against a live Hostinger account from this workspace.

Set the server-side values from `config.example.php` in Hostinger environment/configuration before using these files. Never commit `ADMIN_UID` or other production server secrets.
