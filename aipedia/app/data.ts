// app/data.ts

export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    category: 'LLM',
    description: 'A conversational AI model developed by OpenAI that excels at natural language tasks.',
    link: 'https://chat.openai.com'
  },
  {
    id: '2',
    name: 'Midjourney',
    category: 'Image Gen',
    description: 'Generates high-quality images from natural language descriptions via Discord.',
    link: 'https://midjourney.com'
  },
  {
    id: '3',
    name: 'Claude',
    category: 'LLM',
    description: 'An AI assistant by Anthropic focused on safety and large context windows.',
    link: 'https://anthropic.com/claude'
  },
  {
    id: '4',
    name: 'Hugging Face',
    category: 'Platform',
    description: 'The "GitHub of AI" - a platform for sharing models, datasets, and demos.',
    link: 'https://huggingface.co'
  }
];