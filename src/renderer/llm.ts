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

  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 3000);
  // });

  return `Date,Description,Amount,From,To
02/05/2024,Grab* A-6BIRC69GW/2L,23.80,Account:HSBC Revolution,Expense:Transport
02/05/2024,GREAT EASTERN GENERAL,212.80,Account:HSBC Revolution,Expense:Uncategorised
02/05/2024,FAIRPRICE FINEST-THOMS,5.78,Account:HSBC Revolution,Expense:Groceries
02/05/2024,BURP KITCHEN (BISHAN A,40.77,Account:HSBC Revolution,Expense:Food
02/05/2024,BUS/MRT 428555175,2.82,Account:HSBC Revolution,Expense:Transport
23/05/2024,OTHER BANK CARDHOLDER PAYMENT,3401.85,Account:DBS Savings,Account:HSBC Revolution
21/05/2024,Grab* A-6E67AWBGWHOA,25.10,Account:HSBC Revolution,Expense:Transport
16/05/2024,HEROKU* APR-94750335,2.18,Account:HSBC Revolution,Expense:Utilities
03/05/2024,BUS/MRT 429020139,1.09,Account:HSBC Revolution,Expense:Transport
30/04/2024,HOKKAIDO-YA,30.30,Account:HSBC Revolution,Expense:Food
30/04/2024,GIANT-AMK 161,15.00,Account:HSBC Revolution,Expense:Groceries
30/04/2024,BUS/MRT 427641830,4.59,Account:HSBC Revolution,Expense:Transport
29/04/2024,Peperoni Greenwood,212.44,Account:HSBC Revolution,Expense:Food
29/04/2024,DECATHLON CENTREPOINT,99.90,Account:HSBC Revolution,Expense:Shopping
29/04/2024,KOUFU PTE LTD,5.80,Account:HSBC Revolution,Expense:Food
29/04/2024,Orchard Central,44.80,Account:HSBC Revolution,Expense:Food`;

  // const message = await anthropic.messages.create({
  //   max_tokens: 2048,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: [
  //         ...imagesContent,
  //         {
  //           type: 'text',
  //           text: "Extract the transactions in these images into a csv with columns Date, Description, Amount, From, To. Populate the From column with 'Account:HSBC Revolution' and the To column with these values: Expense:Transport, Expense:Groceries, Expense:Food, Expense:Shopping, Expense:Utilities, Expense:Uncategorised. Remove any 'SINGAPORE SG' or 'Singapore SG' from the end of the description fields. Only return the csv, do not include any explanation text at the start or end.",
  //         },
  //       ],
  //     },
  //   ],
  //   model: 'claude-3-sonnet-20240229',
  // });

  // return message.content[0].text;
}

export { parseTransactions };
