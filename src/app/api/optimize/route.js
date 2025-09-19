import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Please optimize this AI prompt for clarity, effectiveness, and completeness. Make it more specific, actionable, and well-structured while maintaining the original intent:

ORIGINAL PROMPT:
${prompt}

OPTIMIZATION GUIDELINES:
- Enhance clarity and specificity
- Improve structure and organization
- Add any missing important elements
- Make instructions more actionable
- Ensure proper formatting
- Maintain the original core intent and requirements

Provide only the optimized prompt as your response, without any explanation or commentary.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ optimizedPrompt: data.content[0].text });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize prompt' },
      { status: 500 }
    );
  }
}
