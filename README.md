# FORM — Employee Request Demo

A bilingual employee-request wizard, one question at a time. Explore medical absence, late arrival, permission to leave, emergency, and time-off requests.

Built by [MhmedMii](https://github.com/MhmedMii).

**[Try the live demo](https://form-request-demo.vercel.app)** · **[View the source](https://github.com/MhmedMii/form-request-demo)**

> **All profiles, reasons, attachments, and receipts are fictional.** Requests stay in this browser. Email, Google Sheets, Drive, and employer notifications are disabled.

![FORM Olive & Cream request workspace with fictional data](docs/screenshots/form-request-types.png)

## What it does

- Choose a fictional employee and request type.
- Follow a conditional flow: dates for time off, a sample PDF for medical absence.
- Review the request and create a simulated receipt.
- Download the generated PDF or receipt.
- Switch Arabic/English and light/dark themes.
- Reset the demo; drafts persist within the current browser tab.

## Try the workflow

1. Select a fictional profile.
2. Choose a request type, click **Continue**, and select a sample reason.
3. Set dates or attach the generated sample PDF when prompted.
4. Review the details and click **Submit demo request**.
5. Download a fictional receipt or try another request.

Real names, contact information, medical files, and free-text personal details are not collected.

## Design and architecture

Olive & Cream: warm cream surfaces, muted olive accents, editorial serif headings, and a contextual request panel. A compact progress strip and responsive layouts keep the form focused. The text-only FORM identity contains no company logos. Georgia pairs with Manrope for English; Noto Sans Arabic supports Arabic.

```text
app/                  Next.js layout, page, health, and disabled submit API
components/wizard/    Question screens, answers, review, and navigation hooks
components/ui/        Header, progress, and footer
lib/                  Fictional profiles, flow rules, validation, draft persistence
apps-script/          Sanitized backend reference; entry points and setup disabled
tests/                Business-rule and service-isolation checks
e2e/                  Browser workflow checks
```

The wizard coordinates state; question-flow builds the conditional steps; answer components render each input; validation checks predefined fictional records. Submissions are simulated locally without calling a backend.

The original production application is separate. Its credentials, deployment linkage, company images, and data were not copied.

## Stack

Next.js, React, JavaScript, plain CSS, Phosphor icons, locally bundled fonts. Node test runner and Playwright verify the demo.

## Run locally

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

No environment file, Google account, database, or secret is required.

## Checks

```bash
npm test
npm run lint
npm run format:check
npm run demo:check
npm run build
```

For browser tests:

```bash
npx playwright install chromium
npm run test:e2e
```

## Copyright

Copyright © 2026 [MhmedMii](https://github.com/MhmedMii). All rights reserved.

Public portfolio demonstration with fictional information.
