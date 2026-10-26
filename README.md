# Fabrica Invest

Buildless responsive storefront based on the user-provided reference,
https://walidtoolsprovider.com/, with Fabrica Invest branding, six advertising
platform services, 14 account offers at owner-supplied USD prices, and three
priced bundles. The owner WhatsApp is +212650290546. USD is the default currency.

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

Enquiries are saved through Netlify Forms before the visitor reaches the
confirmation page. Personal contact fields are posted to Netlify; browser session
storage retains only the package and confirmation reference. WhatsApp is an
optional contact route. Currency and privacy preferences use local storage.

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
`generate_lead` after a successful saved enquiry, and `whatsapp_click`.
Names, phone numbers, email addresses and enquiry notes are not included in our
Analytics events. Lead values are quotes, not completed payments; this site does
not emit `purchase` events.

In Google Analytics:

1. Use **Realtime** to check a visit after allowing analytics on the website.
2. Use acquisition reports for visits and sources, and demographic/user-attribute
   reports for countries. Select the date range and daily, weekly or monthly view.
3. Enable **Google signals** in the property's data-collection settings if you
   want age, gender and interests. These require visitor consent and enough data;
   demographics can remain unknown or thresholded. Site consent does not enable
   Google signals in the property automatically.
4. Mark `generate_lead` as a key event to report saved enquiries as conversions.
   Our custom event measures successful saves; avoid treating automatic form
   submission attempts as completed enquiries.
5. Keep automatic user-provided-data collection off. The form's contact data
   belongs in Netlify Forms, not in Analytics. Disable automatic form-interaction
   tracking if you want to use only the confirmed-save event supplied here.

Analytics reflects consenting, measurable visitors; it does not reconstruct
traffic from before installation. Set the property's reporting timezone and
currency as appropriate (Africa/Casablanca and USD for this business).

## Saved enquiries in Netlify

1. In this project's Netlify dashboard, open **Forms** and select **Enable form
   detection**. Redeploy after enabling it so Netlify detects the static form.
2. The detected form is named **orders**. Successful submissions are listed in
   **Forms → orders**. It includes contact details, package, quoted price,
   preferred payment, optional notes and a reference beginning `FI-`.
3. Email notifications are optional: configure them under **Forms → Submission
   notifications** in your Netlify account.

The form posts to Netlify before displaying `/order-received/`. Failed or timed-out
submissions show an error and can be retried. Optional analytics is not required
to submit an enquiry. WhatsApp remains a separate optional contact action and
is no longer required to deliver the enquiry.

No customer data is stored in GitHub. Netlify form detection and Google property
settings must be managed by the site owner in their respective dashboards.
