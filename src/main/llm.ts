import Anthropic from '@anthropic-ai/sdk';
import { ImageBlockParam, TextBlockParam } from '@anthropic-ai/sdk/resources';

const anthropic = new Anthropic({
  apiKey: '',
});

async function callAnthropicApi(
  content: string | (TextBlockParam | ImageBlockParam)[],
) {
  console.log('calling anthropic, content:', content);
  const message = await anthropic.messages.create({
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: content,
      },
    ],
    model: 'claude-3-sonnet-20240229',
  });

  console.log('message.content[0].text :>> ', message.content[0].text);

  return message.content[0].text;
}

export { callAnthropicApi };
