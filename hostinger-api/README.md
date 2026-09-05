# Hostinger upload API

Upload `api/upload-image.php` to `public_html/api/upload-image.php` on Hostinger. The existing `public_html/website/logo`, `qr-code`, and `google-play` folders must be siblings of `api`.

Before deployment, edit `PUBLIC_BASE_URL` and `ALLOWED_ORIGINS` in the PHP file. Add the final admin-panel origin to the allowlist. Do not use `*` for production CORS. Confirm PHP has the Fileinfo extension enabled.

The API accepts only `POST multipart/form-data` with `image` and one controlled `type`: `logo`, `qr-code`, or `google-play`. It validates MIME, extension, and 5 MB size, generates a random filename, and never exposes filesystem paths. It has not been tested against a live Hostinger account from this workspace.
