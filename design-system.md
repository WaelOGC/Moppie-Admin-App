📌 Moppie Admin App – Full Design Reference

🎨 1. COLOR SYSTEM
✅ Primary Colors (from client brand – adjusted for dashboard use)
Purpose	Light Mode	Dark Mode	Notes
Primary	#7AC142	#94E36C	Moppie’s green tone
Accent / CTA	#FFD700	#FFEC8B	Soft yellow for buttons
Info / Highlight	#00B7E0	#50D3F5	For status/info chips
Error	#F44336	#EF9A9A	Rejected bookings, alerts
Success	#4CAF50	#81C784	Success states
Background	#F9FAFB	#0F172A	Clean light / dark contrast
Card / Surface	#FFFFFF	#1E293B	Main card backgrounds
Text (Primary)	#111827	#F8FAFC	Sharp, readable
Text (Secondary)	#6B7280	#94A3B8	Subtitles, labels
Border/Divider	#E5E7EB	#334155	For cards, tables

Use CSS variables for all color tokens:

:root {
  --color-primary: #7AC142;
  --color-accent: #FFD700;
  --color-info: #00B7E0;
  --color-error: #F44336;
  --color-success: #4CAF50;
  --bg-light: #F9FAFB;
  --bg-dark: #0F172A;
  --text-light: #111827;
  --text-dark: #F8FAFC;
  /* etc. */
}

🧩 2. UI COMPONENT STYLE GUIDE
✅ Cards & Widgets

3D elevation (shadow layer 1–4)

Rounded corners (border-radius: 12px)

Drop shadows:

Light mode: box-shadow: 0px 4px 16px rgba(0,0,0,0.06)

Dark mode: box-shadow: 0px 4px 12px rgba(0,0,0,0.2)

Hover state: slight scale (transform: scale(1.02))

✅ Buttons

Filled buttons: primary, success, danger, secondary

Outlined versions for light contrast

Micro-interactions: bounce/shrink on click

✅ Sidebar

Icon + label format

Highlight active menu item (glow border / gradient bar)

Expand/collapse with animated width

Auto-highlight on scroll to section

✅ Navbar / Topbar

Profile avatar dropdown

Notifications bell (with unread badge)

Theme switch toggle (🌞/🌙)

Search bar with focus animation

✅ Tables

Responsive tables with horizontal scroll on mobile

Row hover highlight

Action buttons on row end (View, Edit, Delete)

Compact mode toggle

✅ Badges

Rounded pill style

Color-coded: Approved (green), Pending (yellow), Rejected (red), etc.

Subtle shadows for 3D pop

✨ 3. ANIMATION & EFFECTS
✅ Microinteractions

Buttons: click shrink → bounce → ripple

Inputs: label float + glowing border on focus

Toasts: slide-in from bottom right with fade-out

✅ Global Animations

Page transitions: fade in + slide up

Cards/widgets: fade-in staggered

Calendar events: expand-on-click

Modals: scale-in from center

✅ Hover Effects

Cards: lift with shadow

Sidebar items: glow underline or left bar

Tooltips: slight bounce-in

🖼️ 4. ICONOGRAPHY
✅ Library: react-icons

Preferred pack: react-icons/md (Material Icons) or react-icons/lu (Lucide)

Style: solid + rounded

Icon size: 20px–24px

Placement:

Sidebar nav

Section headers

Buttons

Badges

🌓 5. DARK / LIGHT MODE STRATEGY

Use CSS variables for full theming

Store user preference in localStorage

Auto-detect OS theme (prefers-color-scheme)

Dark theme uses softened shadows and lighter contrast for cards

Color system auto-adjusts for text, icons, etc.

Add data-theme="dark" on html for toggling

Animate transition on theme switch (0.3s ease fade + scale)

🧱 6. SPACING & LAYOUT
Element	Size
Base spacing	8px grid
Section gap	32px
Card padding	24px
Button height	44px
Table row height	48px

Mobile-first layout

Use flex + grid where appropriate

Responsive breakpoints:

sm → 640px

md → 768px

lg → 1024px

xl → 1280px

🧪 7. COMPONENTS & PATTERNS

📅 Calendar View: grid calendar with event pills

📋 Booking Table: filter, paginate, sort

🧾 Invoice Card: total + payment button

🛎️ Notifications: toast pop-ups + bell dropdown

🧍 Staff Profiles: avatar, name, role, status

📊 Analytics: chart widgets (mock) + summary cards

⚙️ Settings Form: grouped tabs (General, Security, Notifications)

🔐 Auth Pages: login, 2FA, register, forgot password

📐 8. TYPOGRAPHY
Use	Font Style
Page Titles	font-size: 24px; font-weight: 700;
Section Headers	20px; bold
Body Text	16px; medium
Caption/Labels	14px; light

Font family: Inter, Roboto, or Manrope

Letter-spacing: -0.2px for titles, 0 for body

✅ Final Summary

⚡ 3D look: cards, buttons, modal layers

🎨 Dark/Light mode: supported with CSS vars

🧼 Clean & spacious: soft backgrounds, strong contrast

🧩 Modular: everything reusable + mobile-first

🧠 Usable & accessible: focus states, tooltips, keyboard nav