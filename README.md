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

The enquiry form stores details only in session storage, and currency preference
uses local storage. WhatsApp contact buttons open a message for the visitor to
review and send when the owner number is configured. No external tracking scripts
or original provider APIs are included.

The supplied raster logo was recreated as a vector wordmark for this preview.
Replace `dist/brand/logo.svg` with an original vector logo for exact typography.

## Run locally

From the repository folder, run:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080/`. No Node.js installation, package installation,
or build step is needed. For static hosting, set the publish directory to `dist`.
