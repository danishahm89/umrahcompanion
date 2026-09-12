# Umrah Companion travel app design

_Started 2026-09-11 20:52 UTC_

---

## User

Design a mobile app for domestic and internation tours and travels packages, air tickets, visa and train tickets. Specialized in umrah and hajj services
Company name alzakwaantour and travels pvt ltd
App name Umrah companion developed alzakwaantour and travels pvt ltd
Umrah guide
First time umrah
Important duas during umrah journey
Umrah packing checklist
Vaccine checklist
Latest news synced with saudi officila umrah sources
Nusuk news, details and nusuk services direct links
faq related to umrah
upcoming umrah packages and customize umrah package query

Language support - English, Hindi and urdu

All details should be customized and can be managed by used from admin panel
Enquire links to whatsapp or call button directly

## Assistant



## Assistant

_[tool: list_files]_

_[tool: ask_user]_

_[tool: ask_user]_

Form's up — waiting on your answers on scope, audience, Urdu direction, and where you want variations. I'll start building as soon as you submit.

## User

Answered — primary_user: First-time Umrah pilgrim from India, low tech confidence, Repeat pilgrim who mainly wants packages and prices, Family member booking for elders, Agent/staff at Alzakwaan using it with walk-in custome…; home_priority: Umrah countdown + guide progress (companion-first); lang_behavior: Switcher in header on every screen; urdu_rtl: Show me both; duas_format: Arabic + transliteration + translation, stacked cards, Tied to ritual stage (Ihram → Tawaf → Sai → Halq); enquiry_flow: WhatsApp primary, call second; package_fields: Price from (INR), Duration (nights), Hotel distanc…

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: copy_starter_component]_

_[tool: grep]_

Bundle exports no components, so I'll compose with the Modernist stylesheet tokens/classes directly. Building now.

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: show_html]_

_[tool: ready_for_verification]_

Umrah Companion is up — a single interactive phone (15 screens, tappable throughout) with a screen jump-rail and assumptions on the left, and the two admin panels on the right.

Notes: language switches live in the header (EN / हिं / اردو), and Settings has the RTL-vs-LTR Urdu toggle so you can compare both. Checklists, guide progress, duas stages, FAQ, package detail and the customize form are all working state. Photography is hatched placeholders — send real images and I'll drop them in. Open question at the bottom of the board: should Hajj be its own tab or a filter inside Packages?

## User

Found issues — fixing…

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Header now clears the status bar and island (sticky at 54px, duas tab strip offset to match), and the tab bar has a 24px safe-area band above the home indicator.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: web_search]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

