# Pivot Knowledge Base
## Capability 001 — Manage Meetings
**Version:** 1.0  
**Status:** Initial approved specification  
**Owner:** DJ Eksteen  
**Applies to:** DJ Eksteen, Digikraal, Farm Feed, Northpoint Realty, and future entities

## 1. Purpose
The Manage Meetings capability exists to organise meetings across multiple entities, reduce preparation time, preserve decisions and discussions, and convert meeting outcomes into linked tasks, workflows, projects, goals and follow-up actions.

Meetings are not isolated calendar events. They are connected operating nodes that may arise from existing work and may generate new work across different businesses.

## 2. Current Operating Context
Meetings are currently separated by entity:
- DJ Eksteen
- Digikraal
- Farm Feed
- Northpoint Realty

The current process records:
- Entity
- Date
- Time
- Person or people involved
- Meeting description
- Location
- Online meeting platform or link where applicable

Meetings may be recurring, once-off, online, in person, at the KWV Buildings office in Paarl, at another party's location, or on site.

Examples of recurring meetings:
- Northpoint Nuts and Bolts — Tuesdays
- Northpoint Pacesetter — Thursdays

## 3. Current Systems
- Google Calendar
- Google Meet
- Zoom
- Gmail
- WhatsApp
- Google Sheets / Excel
- Third-party meeting recording software where available

## 4. Current Workflow
1. A meeting is requested or identified as necessary.
2. Availability is checked.
3. The meeting is assigned to the correct entity.
4. Date, time, participants, description and location are captured.
5. If online, a Google Meet or Zoom link is created or received.
6. The meeting is added to the calendar and meeting register.
7. Daily and weekly meeting views are reviewed.
8. Relevant background information is manually gathered.
9. The meeting takes place.
10. Notes or recordings may be produced.
11. Minutes are prepared.
12. Decisions and action items are extracted.
13. Tasks are assigned.
14. Tasks may flow into other entities, projects, workflows and goals.
15. Follow-up continues until the outcomes are completed.

## 5. Confirmed Requirements

### 5.1 Recurring Meetings
Pivot OS must support:
- Daily, weekly, monthly and custom recurrence
- Editing one occurrence or the full series
- Recurrence exceptions
- Rescheduling without losing history
- Entity-specific recurring meetings

### 5.2 Availability Checking
Before suggesting or confirming a meeting, Pivot OS should check the calendars of all relevant participants.

It should:
- Detect conflicts
- Suggest suitable times
- Consider travel or location
- Distinguish between online and in-person meetings
- Ask for missing participant details
- Avoid double-booking

### 5.3 Voice-First Meeting Creation
The founder should be able to create a meeting by speaking naturally in the mobile app.

Pivot OS should extract:
- Entity
- Date
- Time or time window
- Duration
- Attendees
- Subject
- Location
- Online or in person

When information is missing, Pivot OS must ask only the necessary follow-up questions.

### 5.4 Meeting Preparation
Before a meeting, Pivot OS should prepare a briefing containing:
- Last meeting summary
- Previous decisions
- Open tasks
- Overdue tasks
- Relevant projects
- Relevant deals
- Relevant emails
- Relevant WhatsApp conversations
- Relevant documents
- Relevant development, finance or website activity
- Important changes since the previous meeting
- Suggested agenda
- Questions requiring decisions

### 5.5 During the Meeting — Initial Version
The first version should focus on:
- Recording where legally and operationally permitted
- Transcription
- Speaker identification where possible
- Time-stamped notes
- Secure storage
- Post-meeting analysis

The AI should not actively participate in the meeting in the first version.

### 5.6 Post-Meeting Analysis
Pivot OS should produce:
- Meeting title
- Date and time
- Entity
- Location or meeting link
- Attendees
- Agenda
- Summary
- Topics discussed
- Decisions made
- Open questions
- Risks
- Opportunities
- Action items
- Responsible person
- Due dates
- Linked goals
- Linked projects
- Linked deals
- Linked workflows
- Follow-up meeting requirements

### 5.7 Automatic Work Creation
Meeting outcomes may create:
- Tasks
- Projects
- CRM follow-ups
- Finance actions
- Development tickets
- Marketing campaigns
- Documents
- Approvals
- Calendar reminders
- New workflows
- Goal updates

The user should review and approve suggested work where appropriate.

### 5.8 Priority Filtering
After each meeting, Pivot OS should identify:
- The three highest-impact actions
- Their connection to company goals
- Expected value or impact
- Urgency
- Dependencies
- Responsible person

## 6. Future Improved Workflow
1. Meeting request enters through voice, chat, email, WhatsApp or manual entry.
2. Pivot identifies the correct entity and capability.
3. Pivot checks the calendars of all required participants.
4. Pivot proposes suitable times.
5. The user approves a time.
6. Pivot creates the Google Calendar event.
7. Pivot creates a Google Meet link or records the supplied Zoom link.
8. Pivot sends invitations and reminders.
9. Pivot prepares the agenda and briefing pack.
10. Pivot records or imports the transcript.
11. Pivot analyses the transcript after the meeting.
12. Pivot extracts decisions, tasks, owners and deadlines.
13. Pivot links each outcome to the relevant company, project, deal, workflow or goal.
14. Pivot requests approval of generated actions.
15. Approved actions are created and assigned.
16. Pivot tracks completion.
17. Pivot prepares follow-up reminders.
18. Pivot measures whether the meeting moved the business toward its goals.
19. Pivot learns which meetings are valuable and which can be shortened or replaced.

## 7. AI Agents
### Meeting Coordinator Agent
Creates meetings, checks availability, handles recurring meetings, creates invitations and links, and manages rescheduling.

### Meeting Preparation Agent
Builds briefing packs, drafts agendas, finds open issues and retrieves context.

### Meeting Intelligence Agent
Processes transcripts, produces summaries and minutes, and identifies decisions, risks and opportunities.

### Action Extraction Agent
Creates proposed tasks and workflows, assigns people, suggests deadlines and links work to goals.

### Follow-up Agent
Tracks actions, sends reminders, escalates delays and prepares progress reports.

### CEO Agent
Reviews meeting outcomes across entities, identifies cross-company implications and prioritises high-impact actions.

## 8. Core Data Objects
- Meeting
- Meeting Series
- Meeting Occurrence
- Entity
- Division
- Participant
- Contact
- Location
- Calendar Event
- Online Meeting Link
- Agenda Item
- Transcript
- Meeting Note
- Decision
- Action Item
- Task
- Project
- Deal
- Goal
- Workflow
- Document
- Recording
- Approval
- Reminder
- Follow-up
- Audit Event

## 9. Permissions and Privacy
Meeting access must be controlled by:
- Entity
- Division
- Role
- Participant
- Confidentiality level
- Record owner

Private DJ Eksteen meetings must remain separate from company and team meetings.

The system should retain an audit trail of who created, changed, attended, viewed, generated and approved each item.

## 10. Mobile-First Interface
Main actions:
- Speak to create meeting
- View next meeting
- View today's meetings
- View this week's meetings
- Join online meeting
- Navigate to location
- Open briefing
- Start recording or upload transcript
- Review minutes
- Approve actions

## 11. KPIs
- Meeting preparation time saved
- Meetings created by voice
- Meetings with completed briefings
- Meetings with minutes
- Action items assigned
- Actions completed on time
- Overdue meeting actions
- Average meeting duration
- Meeting-to-outcome conversion
- Recurring unresolved issues
- Revenue or goal progress influenced by meetings
- Meetings that could have been asynchronous

## 12. Continuous Improvement
Pivot OS should learn:
- Which meetings produce meaningful outcomes
- Which attendees are required
- Which recurring meetings are inefficient
- Typical duration by meeting type
- Which agenda formats work best
- Which actions repeatedly become overdue
- Which meetings create revenue or remove bottlenecks
- Which meetings could be replaced by updates or approvals

## 13. Initial MVP Scope
1. Google Calendar integration
2. Voice-based meeting creation
3. Missing-information follow-up questions
4. Entity and division assignment
5. Recurring meetings
6. Daily and weekly calendar views
7. Google Meet link creation
8. Zoom link storage
9. Meeting briefing generation
10. Transcript upload or import
11. Post-meeting summary and minutes
12. Suggested actions and owners
13. Human approval before task creation
14. Linking actions to entities, projects and goals
15. Full activity logging

## 14. Open Technical Questions
- Which transcription provider will be used?
- Will Pivot record meetings directly or import recordings?
- How will consent for recording be handled?
- Which WhatsApp integration will be available?
- How will private and company Google calendars be connected?
- How will Zoom recordings and transcripts be accessed?
- Which data must remain in Google systems versus Pivot storage?
- What retention period applies to recordings and transcripts?

## 15. Capability North Star
> Every meeting should enter Pivot OS with minimal effort, arrive fully prepared, produce clear decisions, create prioritised work, connect to the correct goals and workflows, and remain tracked until the intended outcomes are achieved.
