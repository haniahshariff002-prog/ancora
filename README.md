# Ancora — landing page

Peer-to-peer clothing exchange for students and young professionals in Italy.
Static site: HTML + Tailwind (CDN) + vanilla JS. No build step required.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Structure

```
ancora/
├── index.html              # Page markup (nav, hero, closet, how it works, sign-up, marquee, footer)
├── css/styles.css          # Buttons, scroll reveal, marquee, category chips, reduced-motion
├── js/
│   ├── tailwind-config.js  # Brand colors, fonts, shadows (loads after the Tailwind CDN)
│   └── main.js             # Reveal, item data, search/filter carousel, waitlist form
├── assets/                 # Drop real clothing photos here
└── README.md
```

## Brand tokens

| Token     | Hex       | Use                          |
|-----------|-----------|------------------------------|
| `sage`    | `#B7D1BE` | Page background              |
| `mist`    | `#E6F0E7` | Alternate sections, footer   |
| `blush`   | `#F9D9E7` | Final section, step card     |
| `rose`    | `#F8B4D1` | Highlight blocks             |
| `hotpink` | `#FF1493` | CTAs, key words              |
| `ink`     | `#17241C` | Text, borders                |

Fonts: **Archivo Black** (display) and **DM Sans** (body), loaded from Google Fonts.

## Next steps

- **Real photos:** add files to `assets/`, then set `img: 'assets/your-file.jpg'` on items in `ITEMS` (`js/main.js`). Photos replace the illustrations.
- **Waitlist backend:** find the `TODO` in `js/main.js` and post `email` to your provider (Mailchimp, Brevo, Formspree, Supabase, etc.).
- **Production Tailwind:** the CDN build is for prototyping. For launch, install Tailwind (`npm i -D tailwindcss`), move the theme from `js/tailwind-config.js` into `tailwind.config.js`, and compile a CSS file.
- **Open Graph / favicon:** add `og:image`, `og:title` and a favicon in the `<head>` of `index.html`.
