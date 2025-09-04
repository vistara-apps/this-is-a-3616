import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const generateAdCopy = async (productName, productDescription, platform, imageUrl) => {
  try {
    const platformPrompts = {
      tiktok: "Create viral, trending TikTok ad copy that's engaging, uses current slang, and includes hooks that grab attention in the first 3 seconds.",
      instagram: "Create compelling Instagram ad copy that's visually focused, includes relevant hashtags, and encourages engagement and sharing."
    }

    const prompt = `
Product: ${productName}
Description: ${productDescription}
Platform: ${platform}

${platformPrompts[platform]}

Generate 3 different ad variations with:
1. A catchy headline
2. Engaging body copy (2-3 sentences max)
3. Strong call-to-action
4. Relevant hashtags (for Instagram)

Format as JSON with this structure:
{
  "variations": [
    {
      "headline": "...",
      "body": "...",
      "cta": "...",
      "hashtags": "..." (Instagram only)
    }
  ]
}
`

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are an expert social media marketer and copywriter specializing in viral ad content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const response = completion.choices[0].message.content
    return JSON.parse(response)
  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    // Fallback demo data
    return {
      variations: [
        {
          headline: "🔥 This Changes Everything!",
          body: `Discover why everyone's talking about ${productName}. ${productDescription}`,
          cta: "Get Yours Now →",
          hashtags: platform === 'instagram' ? "#viral #trending #musthave #lifestyle" : undefined
        },
        {
          headline: "You Won't Believe This...",
          body: `${productName} is revolutionizing the way we think about quality and style.`,
          cta: "Shop Now",
          hashtags: platform === 'instagram' ? "#gameChanger #innovation #exclusive" : undefined
        },
        {
          headline: "Secret's Out! 🚨",
          body: `The product celebrities use? It's ${productName}. Limited time only.`,
          cta: "Claim Yours",
          hashtags: platform === 'instagram' ? "#celebrity #secret #limitedTime" : undefined
        }
      ]
    }
  }
}

export const generateImageVariations = async (imageUrl) => {
  try {
    // For demo purposes, return the original image with different filters/styles
    return [
      { url: imageUrl, style: 'original' },
      { url: imageUrl, style: 'vibrant' },
      { url: imageUrl, style: 'minimalist' }
    ]
  } catch (error) {
    console.error('Image generation error:', error)
    return [{ url: imageUrl, style: 'original' }]
  }
}