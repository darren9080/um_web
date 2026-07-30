import { google, type calendar_v3 } from 'googleapis';

// 서비스 계정 방식을 쓴다 (OAuth 사용자 동의 플로우 대신) — 특정 캘린더
// 하나만 서비스 계정 이메일과 공유해두면 되므로 운영 부담이 훨씬 적다.
// GOOGLE_SERVICE_ACCOUNT_KEY는 서비스 계정 JSON 키 파일 전체를 base64로
// 인코딩한 값이다.
function getAuth() {
  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!encoded) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY가 설정되지 않았습니다.');
  }

  let credentials: { client_email: string; private_key: string };
  try {
    credentials = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY를 파싱하지 못했습니다 (base64 인코딩된 JSON이어야 합니다).');
  }

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
}

function getCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID가 설정되지 않았습니다.');
  }
  return calendarId;
}

function getClient() {
  return google.calendar({ version: 'v3', auth: getAuth() });
}

export type GoogleCalendarEventInput = {
  title: string;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
};

export async function listGoogleCalendarEvents(timeMin: string): Promise<calendar_v3.Schema$Event[]> {
  const calendar = getClient();
  const res = await calendar.events.list({
    calendarId: getCalendarId(),
    timeMin,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 250,
  });
  return res.data.items ?? [];
}

export async function createGoogleCalendarEvent(input: GoogleCalendarEventInput): Promise<string | null> {
  const calendar = getClient();
  const res = await calendar.events.insert({
    calendarId: getCalendarId(),
    requestBody: {
      summary: input.title,
      start: { dateTime: input.startsAt },
      end: { dateTime: input.endsAt },
    },
  });
  return res.data.id ?? null;
}

export async function updateGoogleCalendarEvent(eventId: string, input: GoogleCalendarEventInput): Promise<void> {
  const calendar = getClient();
  await calendar.events.update({
    calendarId: getCalendarId(),
    eventId,
    requestBody: {
      summary: input.title,
      start: { dateTime: input.startsAt },
      end: { dateTime: input.endsAt },
    },
  });
}

export async function deleteGoogleCalendarEvent(eventId: string): Promise<void> {
  const calendar = getClient();
  await calendar.events.delete({ calendarId: getCalendarId(), eventId });
}
