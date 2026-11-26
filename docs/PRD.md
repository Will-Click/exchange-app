# Calgary Exchange Student Website

## Product requirements document

Version 2 draft • November 23 2026 • Project owner Will Johannson

This document defines the first version of a website for incoming exchange students at the University of Calgary. It brings preparation resources, local experiences, and a semester community into one place. The first release serves one university in one city so the team can build and test a useful product within the scope of a university assignment.

This is a student project intended to produce a working MVP for a pitch. Preparation, discovering activities, and meeting people are equally central to its value proposition. AI will assist development, database integration, and deployment; there is no student facing AI feature. The product name is a working description. Requirements below translate the proposed idea into a buildable scope; suggested implementation choices and pilot targets remain open to revision.

## 1 Problem and product goal

Incoming exchange students must navigate unfamiliar housing resources, entry and study information, transport, and university services while preparing to move. After arriving, they need ways to discover activities and meet other exchange students. These needs span multiple websites and informal groups.

This is the problem hypothesis to validate with incoming and former exchange students. We have not yet established how well existing university resources and student groups meet these needs.

Our goal is to help a student answer three questions: What should I prepare before coming? What can I do once I arrive? Who else is here for my exchange?

The intended value is a personalized starting point and a community organized around the same exchange semester. The website links to the organizations responsible for housing, immigration information, event registration, and services.

## 2 Target users and launch scope

The primary user is a student outside Canada planning or completing an exchange at the University of Calgary. Students may have secured housing already, may still be looking, and may have different citizenships, arrival dates, budgets, and interests.

The secondary user is an administrator who maintains resources and events, manages semester groups, and moderates discussions. No university partnership or official affiliation is assumed.

The MVP is an English language, mobile friendly website. Calgary and the University of Calgary are fixed destinations. It supports upcoming exchange semesters and students staying across more than one semester. Anyone may register without proving exchange status, including local students and other interested users. The content and onboarding remain specifically designed for incoming University of Calgary exchange students. Other universities and cities are future expansion opportunities, outside the MVP. Supporting users can select a semester community without claiming to be exchange students.

## 3 Core student experience

1. A student opens the website and sees who it is for and what it offers.
2. They create an account with their name and email, verify their email, and complete a short onboarding survey.
3. Their dashboard presents two main sections: **Before Arrival** and **During Your Stay**. The second section covers arrival and the remainder of the exchange.
4. Before Arrival shows preparation topics, relevant resource links, and a simple checklist based on their answers.
5. During Your Stay shows an events calendar for the university, Calgary, and the Rocky Mountains, alongside access to the semester discussion board.
6. They browse events, follow organizer links, introduce themselves, and connect through shared interests and discussions.

Both sections remain accessible at all times. The arrival date determines which section is highlighted, and an “I have arrived” control lets the student change that default. Students can explore events and meet their semester group before travelling.

## 4 Account and onboarding requirements

**ACC 01 Account access.** Students can register, verify their email, sign in, sign out, and recover access. Email verification confirms control of an address; it does not verify exchange admission. A university email address is not required because incoming students may not have one yet.

**ACC 02 Survey.** The survey collects the following fields. Required fields must have clear validation; students can edit their answers later.

| Field | Required | Purpose and visibility |
| --- | --- | --- |
| Name and display name | Yes | Display name appears on community posts |
| Email | Yes | Authentication and account communications; private |
| Country of residence or departure | Yes | Understand where the student is travelling from; private by default |
| Citizenship or passport country | Optional | Route to relevant official entry and study resources; private |
| Destination city | Fixed | Calgary, visibly preselected |
| Host university | Fixed | University of Calgary, visibly preselected |
| Participation type | Yes | Incoming exchange student or other interested member; no admission verification |
| Home university | Optional | Profile context; sharing is optional |
| Exchange semester or semesters | Yes | Community access and relevant events |
| Expected arrival date | Yes, or not sure yet | Dashboard stage and preparation planning; private |
| Expected departure date or stay duration | Optional | Resource context and event date filtering; private |
| Housing status | Yes | On campus confirmed, off campus confirmed, still looking, or unsure |
| Interests | Optional | Multiple selections such as hiking, skiing, sports, music, food, nightlife, arts, and volunteering |
| Activity budget preference | Optional | Free, lower cost, or any budget |

Do not treat residence, departure country, and citizenship as interchangeable. Students can skip citizenship and still access general official resources. Do not collect passport numbers, document scans, visa application files, or home addresses in the MVP.

**ACC 03 Profiles and settings.** Students can change their display name, interests, survey answers, and profile visibility, and request account deletion. Only display name and chosen public interests are visible to other signed in members by default. Citizenship, dates, housing status, and login email remain private. Students can separately add an optional contact email, social handle, or contact link to their member profile. Contact fields are blank by default, can be edited or removed at any time, and are shown only after the user explicitly chooses to share them. Never automatically copy the login email into a visible field. A profile preview must show exactly what other members can see. Public, signed out visitors cannot view member contact details.

**Acceptance criteria.** A verified student can finish onboarding with all required fields and no optional fields. Their selections survive sign out and sign in. Changing housing status or semester updates the relevant dashboard content and community permissions. A student who chooses “not sure yet” for arrival can select their stage manually.

## 5 Before Arrival requirements

**PRE 01 Preparation dashboard.** Present housing, official entry and study resources, transportation, useful apps, eSIMs, Calgary weather preparation, and course registration as clear topic cards. Each card includes a short explanation, relevant links, and actionable checklist items personalized to the student’s origin, citizenship where supplied, stay duration, housing status, and arrival season. Only students mark their items complete, undo completion, or mark an item not applicable; visiting a link must never complete an item automatically. Progress persists across sessions. If profile answers change, recalculate applicable items, preserve progress for unchanged items, and flag newly relevant items without resetting the entire checklist. Do not invent regulatory deadlines from the arrival date.

**PRE 02 Housing resources.** Students still looking for accommodation see housing prominently. Provide curated links to university housing information, off campus accommodation resources, and rental search services, with brief explanations of what each offers. Include source reviewed guidance on evaluating listings and avoiding rental scams. Students with housing can still open the section. The website does not host listings, contact landlords, guarantee availability, or process rental payments.

**PRE 03 Official entry and study resources.** Provide links to Canadian government and University of Calgary international student resources. Ask students to use the official tools to determine requirements for their circumstances. For supported country and stay combinations, administrators must confirm the applicable preparation steps against current official sources before publishing country specific checklist rules. Each such step includes its source, conditions, and review date. Citizenship and stay duration must inform relevant rules rather than relying only on departure location. The website summarizes verified source information and links to official confirmation; it must not guarantee eligibility or approval. Missing inputs or an unreviewed country combination must produce a visible “requirements need confirmation” state and official next steps, rather than a guessed answer.

Use transparent, administrator maintained routing rules for the MVP. Where information is missing or a case is unsupported, show general official resources and university support contacts. Before launch, review all wording and links against current official sources. This PRD does not establish any immigration requirement.

**PRE 04 Transportation.** Provide curated resources on airport arrival, getting to campus, local transit, fares or student pass information, and route planning. Link to current provider information instead of hard coding prices or eligibility rules.

**PRE 05 Useful apps.** List reviewed apps or websites for transit, university services, navigation, weather, and local activities. Each entry has a purpose, platform or web links, source, and review date. Final app selection is a content task before launch.

**PRE 06 eSIM resources.** Include links to eSIM providers, a short explanation of setup, and prompts to check device compatibility, coverage, validity, and plan terms with the provider. No purchase or activation occurs on the website.

**PRE 07 Weather preparation.** Show seasonal Calgary weather and packing guidance relevant to the arrival period, with reviewed sources and links to forecasts. Distinguish general seasonal advice from live conditions; do not imply a live weather feed exists in the MVP.

**PRE 08 Course registration.** Include checklist steps and official University of Calgary links for exchange course selection, registration instructions, prerequisites or restrictions, and help contacts. Display deadlines only when confirmed for the relevant term. No direct course enrollment or university system integration is included.

**Acceptance criteria.** A student looking for housing sees housing near the top of their dashboard. A student without citizenship information can still reach official study resources. Every published resource has a working source URL, a category, and a last reviewed date. Completing a checklist item never implies completion of an official application or university requirement.

## 6 During Your Stay requirements

**EVT 01 Calendar and list.** Students can switch between a calendar and a mobile friendly chronological list. The default is upcoming events during their exchange period, with controls to browse other dates. Show university events, Calgary events, and Rocky Mountain activities as distinct categories.

**EVT 02 Filters.** Support date range, location category, interests or activity tags, and free or paid events. Interest matching uses tags rather than an AI recommendation model. Students can always view all events and clear filters.

**EVT 03 Event details.** Each record includes a title, description, category, activity tags, organizer, date and time, venue or location, price or “check organizer,” original source link, booking or information link, and last reviewed date. Display eligibility and transport information when confirmed; otherwise identify them as unknown. Event times use the America/Edmonton time zone, with appropriate daylight saving handling.

**EVT 04 Mountain activities.** Separate scheduled events from general activity ideas. An ongoing hiking or skiing idea must not appear as a confirmed event on an invented date. Mountain entries should identify external booking or information links, transport availability where known, and links to current organizer or official conditions information. Do not imply that transportation is included.

**EVT 06 Partnerships and discounts.** Support optional administrator entered partner business details, a discount code, offer description, expiry date, restrictions, redemption link, and a sponsored or partner label. Show an offer only while published and valid; never invent a partner or active discount. Redemption takes place on the business’s website or through its stated process. Label illustrative pitch data as demo content. For this student project, paid business listings or referral arrangements are a future business hypothesis, with pricing and commercial agreements undecided. There is no student subscription, business payment collection, or partner self service portal in the MVP.

**EVT 05 Content management.** Administrators manually curate the initial calendar. They can add, edit, cancel, unpublish, and expire events. Students register or buy tickets on external websites. Clearly label cancellations and avoid showing expired events as upcoming.

**Acceptance criteria.** Applying filters changes both calendar and list results consistently. An event opens its correct external source or booking page. Empty results offer a clear reset option. Canceled events show their status. Undated activity ideas appear in a separate activities area rather than calendar date cells.

## 7 Semester community requirements

**COM 01 Cohorts and access.** Create discussion boards for University of Calgary exchange cohorts, identified by semester and year. Verified users join the cohort or cohorts selected in onboarding. Students staying two semesters can access both. Authorization must be enforced on the server, including when someone requests a post directly by its URL.

Membership is self declared in the MVP. Do not present users as university verified exchange students. Admission verification can be considered after the pilot.

**COM 02 Discussions.** Members can create text posts, add replies, and edit or delete their own contributions. Categories include introductions, housing questions, campus life, activities, and general questions. Show the author’s display name, timestamp, and optional interest tags. Support basic category and interest filtering so students can find shared interests.

**COM 03 Connecting.** Members can introduce themselves, discuss an event, or suggest a group activity within a thread, including before arrival. Clicking an author opens their member profile with any voluntarily shared contact information. Students arrange further contact outside the website. There is no student event creation tool, RSVP system, private messaging, automatic friend matching, image upload, or live chat in the MVP. Activity invitations remain ordinary forum posts and do not automatically become calendar events.

**COM 04 Moderation.** Members can report posts and replies. Administrators can review reports, remove content, suspend accounts, and pin welcome information or community rules. Include clear rules on harassment, spam, scams, and posting other people’s personal information. Add basic posting rate limits.

**COM 05 Semester lifecycle.** Keep active semester boards writable. Administrators can archive completed cohorts as read only for existing members. Cohort membership changes must update access consistently; onboarding selection is a grouping mechanism, not proof of admission.

**Acceptance criteria.** Two members of the same cohort can post and reply to one another. A user outside that cohort cannot read its posts through a direct request. A user cannot modify another student’s post. Reports enter an administrator queue, and removed content is unavailable to ordinary members. An empty board offers an introduction prompt. A profile without optional contact details remains usable. Removing a shared contact field removes it from member views and API responses. Login email stays private unless separately entered and deliberately shared as a contact address.

## 8 Administration and content operations

Provide a protected administrator area to manage resources, routing rules, events, semesters, reports, and account suspensions. Ordinary users must not be able to grant themselves administrator privileges.

Each resource or event has a responsible editor and a last reviewed date. Before the pilot, review every published link and event. During the pilot, review upcoming events weekly and resources monthly, with extra checks when a source reports changes. These are proposed operating commitments and need a named owner.

Separate university announcements, third party events, general activity ideas, and student suggestions. Do not imply affiliation or endorsement without permission. Manual curation is the initial content strategy; automated scraping and paid integrations are deferred.

## 9 Information architecture and data

Main pages are the landing page, account access, onboarding, dashboard, Before Arrival, During Your Stay, event details, semester community, profile and settings, and administration. Privacy information, community rules, and a way to report inaccurate resources must be easy to find.

| Entity | Main information |
| --- | --- |
| User and profile | Account ID, private email, display name, role, verification state, participation type, interests, optional shared contact fields and visibility |
| Exchange profile | Residence or departure country, optional citizenship, home university, host university, arrival details, housing status |
| Semester and membership | Semester ID, year, dates, university, user memberships, archive state |
| Resource | Category, description, source URL, applicable rules, editor, review date, publication state |
| Checklist progress | User, item, complete or not applicable state |
| Event or activity | Scheduled or ongoing type, dates if scheduled, location, tags, cost, organizer, links, review and cancellation state, partner label, discount code and offer terms |
| Post and reply | Cohort, author, text, category, tags, timestamps, moderation state |
| Report | Reporter, content reference, reason, review status, administrator action |

## 10 Quality and privacy requirements

The website must work on mobile and desktop, with keyboard navigation, readable contrast, labeled fields, and accessible calendar alternatives. Target WCAG 2.2 AA during implementation and review. Show clear loading, empty, error, and success states; avoid losing a student’s draft when submission fails.

Use encrypted connections, a maintained authentication service, protected administrator permissions, input validation, and server enforced access controls. Render community text safely and restrict external links to safe URL schemes. Do not expose private survey responses through public profiles, URLs, analytics, or community APIs.

Explain data collection during onboarding. Keep marketing permission separate from account access, with marketing out of the MVP. Provide a documented deletion process and decide how deleted accounts affect past posts before launch. Use aggregate analytics without recording private message bodies or sensitive profile fields.

Proposed performance target: core pages become usable within three seconds on a representative mobile connection using the pilot dataset. Confirm the measurement method during implementation.

## 11 Scope and build sequence

| Release | Included |
| --- | --- |
| MVP foundation | Registration, verification, survey, editable profile, semester membership, two section dashboard |
| MVP preparation | Curated housing, official study resources, transit, apps, eSIMs, weather, course registration, manual checklist progress, reviewed country rules |
| MVP experience | Curated event calendar and list, activity ideas, filters, external booking links, optional partner discounts |
| MVP community and operations | Posts, replies, member profiles with optional contact details, tags, reporting, admin moderation, resource and event management |
| Later options | Saved events, calendar export, opt in reminders, multiple universities, language support |

Private messaging, native mobile apps, housing transactions, ticket sales, automatic admission verification, automated immigration advice, and an AI chatbot are outside the MVP. The core experience can run with structured content and simple rules. AI is a development tool for building the site, connecting its database, and helping deploy it, rather than a product feature. Hosting should be on Vercel or Netlify; select one during implementation based on the chosen application framework. The MVP requires persistent database storage for accounts, survey answers, progress, events, profiles, and discussions. Use a managed authentication and database service selected during implementation. Secrets must remain in server environment configuration. No live partnerships or payment infrastructure are required for the pitch.

Build the account and data foundation first, then preparation content, the events experience, and the community. Complete access control, moderation, and content review before inviting pilot students. Do not launch the discussion board without an available moderator.

## 12 Validation and success measures

Before finalizing the design, interview approximately five incoming or former University of Calgary exchange students. Ask how they found housing and official resources, what they missed, which event channels they used, and how they met people. Test whether one combined website solves a meaningful gap.

Run a small pilot with approximately 15 to 25 students where practical. The targets below are proposed learning goals, not forecasts or evidence of demand.

| Measure | Proposed pilot target |
| --- | --- |
| Onboarding completion | At least 80 percent of verified signups finish required survey fields |
| Preparation engagement | At least 60 percent of onboarded students open a preparation resource in their first week |
| Event engagement | At least 50 percent of arrived pilot students open event details or follow an organizer link within two weeks |
| Community participation | At least 40 percent of onboarded students create a post or reply during the pilot |
| Perceived usefulness | At least 70 percent of survey respondents rate usefulness 4 or 5 out of 5, with response count reported |

Record signup completion, resource clicks, event interactions, and community participation using minimal analytics. External link clicks demonstrate interest, not completed applications, bookings, or event attendance. Collect qualitative feedback about preparation confidence and whether students made useful connections.

## 13 Launch acceptance and open decisions

The MVP is ready for a pilot when a student can register, complete onboarding, access both main sections, persist checklist progress, find an event, and participate in the correct cohort. An administrator must be able to maintain content and resolve reports. Access controls must pass tests for private profile fields, cross cohort requests, author permissions, and administrator actions. All published resources must be reviewed and empty or failed states usable on mobile.

The following decisions remain open and do not prevent initial design work:

- Final product name and visual identity.
- First pilot semester and how students will be recruited.
- Whether any university office will participate; no relationship is assumed.
- Who will maintain content and moderate discussions during the pilot.
- Account deletion and archived community retention policy.
- Choice of Vercel or Netlify and the managed database and authentication service.
- Which origin countries will have fully reviewed checklist rules in the first demo; other countries receive the explicit confirmation fallback.
- Any future partner pricing or referral model; no commercial arrangement is assumed for the student project.

The first design should demonstrate one complete journey: a student preparing for a Calgary exchange finds relevant resources, arrives with a clear starting point, discovers something to do, and meets peers in their semester community.
