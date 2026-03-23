# Hostinger Deployment Guide for PDFKnife

PDFKnife is a React Single Page Application (SPA). To host it on Hostinger (Shared Hosting or VPS), follow these steps:

## Prerequisites
- Node.js and npm installed locally.
- Access to your Hostinger File Manager or SSH.

## Step 1: Build the Project
Run the following command in your terminal to create a production-ready build:
```bash
npm run build
```
This will generate a `dist` folder in your project directory.

## Step 2: Prepare for Hosting

### For Hostinger Shared Hosting (HPanel)
1. Open Hostinger **hPanel**.
2. Go to **File Manager** (under the website section).
3. Navigate to `public_html/`.
4. Upload all files from the `dist` folder into `public_html/`.
5. Ensure the `.htaccess` file (included in `dist`) is also uploaded. This file is critical for React Router to function properly.

### For Hostinger VPS (using Nginx/Apache)
- If you are using Apache, use the `.htaccess` file provided.
- If you are using Nginx, you will need to add the following block to your server configuration:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```

## Troubleshooting

### Routing issues (404 on refresh)
If you refresh a page other than the homepage and get a 404 error, ensure the `.htaccess` file is present in your Hostinger `public_html` directory.

### Asset Loading issues
If assets (images, CSS, JS) are not loading, check the `base` configuration in `vite.config.ts`. It is currently set to `./` for relative paths, which should work for most root and subdomain deployments.
