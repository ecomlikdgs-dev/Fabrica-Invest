# Fabrica Invest

Buildless responsive storefront based on the user-provided reference,
https://walidtoolsprovider.com/, with Fabrica Invest branding, six advertising
platform services, 14 account offers at owner-supplied USD prices, and three
priced bundles. The owner WhatsApp is +212767398411. USD is the default currency.

Bundles combine the listed account price with the retained reference tool-plan
price: Meta Launch $37, Media Buyer Pack $62, Growth Stack $120.

Serve `dist/` with any static server. The `.openai/hosting.json` manifest selects
the hosted project's static directory. There is no dependency installation or
build step for deployment.

## Content to confirm

- Optional email and social URLs can be supplied in `dist/brand/config.js`.
- Original reference tool-plan prices are retained in MAD and USD. Account
  prices use the supplied USD catalog, with three bundles calculated from those
  account prices and tool-plan prices.
- The 27 original voice reviews and six written reviews are retained, with
  visible reference-provider attribution. They are not represented as Fabrica
  Invest customer endorsements.
- The supplied reference tool walkthrough is retained and identified as a
  reference demonstration. It can be replaced with an owner recording later.
- Confirm business identity and commercial terms in the four legal pages.
- Payment recipient details are deliberately empty; no original recipient
  accounts, payment links or collection endpoints are carried across.

Customers select a package and add their contact details, optional email and
notes, and preferred payment method. The page opens a complete WhatsApp draft
addressed to the owner. The customer must tap Send in WhatsApp. New details are
not posted to Netlify Forms or saved in browser storage. Currency and privacy
preferences still use local storage.

The supplied raster logo was recreated as a vector wordmark for this preview.
Replace `dist/brand/logo.svg` with an original vector logo for exact typography.

## Run locally

From the repository folder, run:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080/`. No Node.js installation, package installation,
or build step is needed. For static hosting, set the publish directory to `dist`.

## Deploy on Netlify

The root `netlify.toml` configures Netlify to publish the ready-to-serve `dist`
directory without running a build command. The homepage is `dist/index.html`;
publishing the repository root instead will produce a Netlify 404 page.

Connect this repository to Netlify and deploy the `main` branch. The deployment
settings are:

- Base directory: repository root (`.`)
- Build command: leave empty
- Publish directory: `dist`

For an existing Netlify site, deploy the latest `main` commit after pulling this
configuration. If Netlify continues showing an older deployment, use **Deploys →
Trigger deploy → Clear cache and deploy site**. The form, payment and legal pages
are separate directories with their own `index.html` files and work without a
single-page-app redirect.

## Analytics

Google Analytics 4 is connected to `G-Z7F7SVKYRC`. The Google tag is loaded only
after the visitor allows website analytics. Audience demographics is a separate
choice and controls Google signals and advertising-related consent. Visitors can
change their choices using **Privacy choices** in the footer. Choices expire
after 180 days.

The integration records page views, `select_offer`, `form_start`,
`whatsapp_order_start` when a complete order is handed off to WhatsApp, and
`whatsapp_click` for general contact. A handoff does not prove the message was
sent. The site no longer emits `generate_lead`.
Names, phone numbers, email addresses and enquiry notes are not included in our
Analytics events. Displayed prices are quotes, not completed payments; this site does
not emit `purchase` events.

In Google Analytics:

1. Use **Realtime** to check a visit after allowing analytics on the website.
2. Use acquisition reports for visits and sources, and demographic/user-attribute
   reports for countries. Select the date range and daily, weekly or monthly view.
3. Enable **Google signals** in the property's data-collection settings if you
   want age, gender and interests. These require visitor consent and enough data;
   demographics can remain unknown or thresholded. Site consent does not enable
   Google signals in the property automatically.
4. Use `whatsapp_order_start` to measure handoffs to WhatsApp. It is an intent
   event, not a confirmed message, delivery or sale. Retire any `generate_lead`
   key-event setup used by the previous Netlify checkout.
5. Keep automatic user-provided-data collection off. Contact details belong in
   the customer's WhatsApp conversation, not in Analytics. The order handoff
   uses buttons rather than a tracked outbound message link so the prefilled
   message is not exposed as an outbound link URL in automatic click events.

Analytics reflects consenting, measurable visitors; it does not reconstruct
traffic from before installation. Set the property's reporting timezone and
currency as appropriate (Africa/Casablanca and USD for this business).

## WhatsApp ordering

1. Choose a spy tools plan, advertising account or bundle. Direct visits to
   `/form/` ask what the customer wants to order.
2. Enter name and WhatsApp number, plus optional email, preferred payment and
   notes. The chosen package and price come from the public catalog.
3. Select **Continue to WhatsApp**. The official WhatsApp app/web page opens
   with the complete draft and an `FI-` reference. The customer reviews it and
   taps **Send**. Fabrica Invest then confirms stock, pricing, payment and access.

The payment-options page also routes through contact details before WhatsApp,
preserving the package and selected method. Old `/order-received/` links point
visitors back to this flow; they do not claim a message or purchase succeeded.
Optional Analytics is not required. No WhatsApp API credentials are needed for
this customer-initiated handoff. The site cannot send messages automatically or
verify delivery. Automatic business notifications would require a separately
configured WhatsApp Business messaging service.

Netlify form detection is no longer needed for new orders. Existing submissions
in the owner's Netlify account are not deleted by this change. No customer data
is stored in GitHub or browser storage by this integration.
