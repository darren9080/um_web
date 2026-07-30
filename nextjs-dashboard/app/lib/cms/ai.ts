type ArticleDraftInput = {
  pressReleaseText: string;
  section: string;
  tone?: string;
};

type SeoInput = {
  title: string;
  body: string;
  section: string;
};

export function cosineSimilarity(vectorA: number[], vectorB: number[]) {
  if (vectorA.length !== vectorB.length || vectorA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < vectorA.length; index += 1) {
    dotProduct += vectorA[index] * vectorB[index];
    magnitudeA += vectorA[index] ** 2;
    magnitudeB += vectorB[index] ** 2;
  }

  const denominator = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

export function buildPressReleaseDraftPrompt(input: ArticleDraftInput) {
  return {
    instructions:
      'You are a Korean newsroom assistant. Write factual, neutral, concise news copy. Do not invent facts. Clearly separate confirmed facts from suggested follow-up questions.',
    input: [
      {
        role: 'user',
        content: [
          `Section: ${input.section}`,
          `Tone: ${input.tone ?? 'straight news'}`,
          'Create a Korean news article draft from this press release.',
          'Return JSON with title, dek, body, fact_check_questions, seo_keywords, image_alt_text.',
          input.pressReleaseText,
        ].join('\n\n'),
      },
    ],
  };
}

export function buildSeoPrompt(input: SeoInput) {
  return {
    instructions:
      'You are an SEO editor for Korean news. Recommend search-friendly metadata without keyword stuffing.',
    input: [
      {
        role: 'user',
        content: [
          `Section: ${input.section}`,
          `Title: ${input.title}`,
          input.body,
          'Return JSON with seoTitle, metaDescription, keywords, canonicalSlug, socialHeadline.',
        ].join('\n\n'),
      },
    ],
  };
}

export async function createEmbedding(text: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create embedding.');
  }

  const payload = (await response.json()) as {
    data: Array<{ embedding: number[] }>;
  };

  return payload.data[0]?.embedding ?? [];
}

export async function measurePressReleaseSimilarity(
  pressReleaseText: string,
  articleBody: string,
) {
  const [pressReleaseEmbedding, articleEmbedding] = await Promise.all([
    createEmbedding(pressReleaseText),
    createEmbedding(articleBody),
  ]);

  return cosineSimilarity(pressReleaseEmbedding, articleEmbedding);
}

type ResponsesPrompt = {
  instructions: string;
  input: Array<{ role: string; content: string }>;
};

// buildPressReleaseDraftPrompt/buildSeoPrompt는 이미 OpenAI Responses API
// 형태({instructions, input})로 프롬프트를 만들어두고 있었지만, 실제로 이
// 엔드포인트를 호출하는 코드가 없었다 — 지금까지 있는 건 임베딩 호출뿐이었음.
async function callOpenAiResponses(prompt: ResponsesPrompt): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured.');
  }

  const model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions: prompt.instructions,
      input: prompt.input,
      text: { format: { type: 'json_object' } },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`OpenAI 요청이 실패했습니다 (${response.status}). ${detail}`.trim());
  }

  const payload = (await response.json()) as { output_text?: string };
  const text = payload.output_text ?? '';

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error('OpenAI 응답을 JSON으로 파싱하지 못했습니다.');
  }
}

export type GeneratedDraft = {
  title: string;
  dek: string;
  body: string;
  fact_check_questions: string[];
  seo_keywords: string[];
  image_alt_text: string;
};

export async function generateArticleDraft(input: ArticleDraftInput): Promise<GeneratedDraft> {
  const prompt = buildPressReleaseDraftPrompt(input);
  return callOpenAiResponses(prompt) as Promise<GeneratedDraft>;
}

export type SeoSuggestions = {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalSlug: string;
  socialHeadline: string;
};

export async function generateSeoSuggestions(input: SeoInput): Promise<SeoSuggestions> {
  const prompt = buildSeoPrompt(input);
  return callOpenAiResponses(prompt) as Promise<SeoSuggestions>;
}

type ProofreadInput = { body: string };

export function buildProofreadPrompt(input: ProofreadInput) {
  return {
    instructions:
      'You are a Korean copy editor. Find typos, spacing errors (띄어쓰기), and grammar mistakes only — do not suggest stylistic rewrites.',
    input: [
      {
        role: 'user',
        content: [
          '다음 한국어 기사 본문에서 오탈자·띄어쓰기·문법 오류만 찾아라. 문체 교정은 하지 마라.',
          'Return JSON with an "issues" array, each item: { original, suggestion, reason }.',
          input.body,
        ].join('\n\n'),
      },
    ],
  };
}

export type ProofreadResult = {
  issues: { original: string; suggestion: string; reason: string }[];
};

export async function generateProofreadSuggestions(body: string): Promise<ProofreadResult> {
  const prompt = buildProofreadPrompt({ body });
  return callOpenAiResponses(prompt) as Promise<ProofreadResult>;
}
