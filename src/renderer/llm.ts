import Anthropic from '@anthropic-ai/sdk';
import { ImageBlockParam } from '@anthropic-ai/sdk/resources';

const anthropic = new Anthropic({
  apiKey: '',
});

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

async function parseTransactions(imageFiles: File[]): Promise<string> {
  const imagesContent: ImageBlockParam[] = [];
  for (let file of imageFiles) {
    imagesContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: await convertToBase64(file),
      },
    } as ImageBlockParam);
  }

  const message = await anthropic.messages.create({
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          ...imagesContent,
          {
            type: 'text',
            text: "Extract the transactions in these images into a csv with columns Date, Description, Amount, From, To. Populate the From column with 'Account:HSBC Revolution' and the To column with these values: Expense:Transport, Expense:Groceries, Expense:Food, Expense:Shopping, Expense:Utilities, Expense:Uncategorised. Remove any 'SINGAPORE SG' or 'Singapore SG' from the end of the description fields. Only return the csv, do not include any explanation text at the start or end.",
          },
        ],
      },
    ],
    model: 'claude-3-sonnet-20240229',
  });

  return message.content[0].text;
}

export { parseTransactions };
