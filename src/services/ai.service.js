import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
    throw new Error('GROQ_API_KEY environment variable is required to initialize Groq client.');
}

const groq = new Groq({ apiKey: groqApiKey });

export const generateDescription = async (propertyData) => {
    const {type, subcity, woreda, kebele, size, floor, price, specialName} = propertyData;

     const prompt = `
    Act as a professional real estate agent in Ethiopia. 
    Write a short, catchy, and professional 3-sentence description for a property listing.
    Details:
    - Type: ${type} (for ${type === 'sale' ? 'sale' : 'rent'})
    - Location: ${subcity}, Woreda ${woreda}, Kebele ${kebele} (${specialName})
    - Size: ${size}
    - Floor: ${floor}
    - Price: ${price} ETB
    Make it sound inviting and mention the specific location details.
  `; 

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-8b-8192",
  });

   return completion.choices[0]?.message?.content || "";
}

export const chatWithData = async (userQuery, propertyList) => {
    const prompt = `
    You are the BetConnect AI Assistant. Your job is to help users find homes in Ethiopia.
    
    User Question: "${userQuery}"
    
    Here are the available properties from our database that match their search:
    ${JSON.stringify(propertyList)}
    
    Instructions:
    1. If there are matches, summarize them nicely and tell the user why they fit their needs.
    2. Mention the subcity, price, and floor.
    3. If there are NO matches, suggest they try searching in a different subcity or budget.
    4. Keep it conversational but professional.
  `;

   const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama3-70b-8192", 
  });

   return completion.choices[0]?.message?.content || "I'm sorry, I'm having trouble finding that right now.";

}