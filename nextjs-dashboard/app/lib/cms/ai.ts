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
