import React,{useState,useRef,useEffect, useContext} from 'react'
// import { GoogleGenAI } from "@google/generative-ai";
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Link } from 'react-router-dom'
import { Navigatorhead } from './Navigatorhead';
import {cat, pipeline} from '@huggingface/transformers';
import { Application } from '@splinetool/runtime';
import { GlobalContext } from '../context/Global';


const ai = new GoogleGenerativeAI({ apiKey: "AIzaSyCjV9bjhvhORRpNSSWofI5yw5VBQH6JhaY" });


const knowledgeBase = [
  {
    question: "what is zuno?",
    answer: "Zuno is your AI financial assistant designed to help with budgeting, expense tracking, and financial planning."
  },{
    question: "who are you?",
    answer: "Zuno is your AI financial assistant designed to help with budgeting, expense tracking, and financial planning."
  },
  {
    question: "what is the purpose of zuno?",
    answer: "The purpose of Zuno is to assist users with their financial decisions, track expenses, suggest savings tips, and make money management easy and fun."
  },
  {
    question: "who created zuno?",
    answer: "Zuno was created by Athish the GOAT!."
  },
  {
    question: "who is your god?",
    answer: "It's Athish — the god behind Zuno!"
  },
  {
    question: "how can zuno help me?",
    answer: "Zuno can help you plan budgets, track your daily expenses, give you insights into your spending habits, and even provide smart financial suggestions."
  },
  {
    question: "can you track my expenses?",
    answer: "Absolutely! Just tell me your expenses and I’ll keep track of them for you in an organized way."
  },
  {
    question: "is zuno free to use?",
    answer: "Yes, Zuno is completely free for users to explore and use to its fullest potential."
  },
  {
    question: "can I save money using zuno?",
    answer: "Definitely! Zuno helps you analyze your spending and suggests effective ways to cut down on unnecessary expenses and save more."
  },
  {
    question: "how secure is my data with zuno?",
    answer: "Your data is handled with utmost care and security. Zuno does not share your personal data with third parties."
  },
  {
    question: "is zuno available on mobile?",
    answer: "A mobile version is in the works! For now, you can access Zuno through any web browser."
  },
  {
    question: "do you support voice input?",
    answer: "Not yet, but voice input is on our roadmap. Stay tuned!"
  },
  {
    question: "can you analyze receipts?",
    answer: "That’s on the way! Soon, you’ll be able to upload receipts and let Zuno do the rest."
  },
  {
    question: "can you connect to my bank?",
    answer: "Bank integrations are being explored! For now, you can manually log transactions or import them via files."
  },
  {
    question: "how do I reset my budget?",
    answer: "Simply head over to the budget settings section and click on 'Reset Budget'. You can then create a new one from scratch."
  },
  {
    question: "how do I view my spending summary?",
    answer: "Click on the 'Analytics' tab in the dashboard to see a breakdown of your expenses by category, date, and more."
  },
  {
    question: "can I categorize my expenses?",
    answer: "Yes! Zuno automatically categorizes your expenses, and you can also manually tag them for more control."
  },
  {
    question: "do you offer investment suggestions?",
    answer: "Investment suggestions are in beta — you’ll soon receive tips based on your savings goals and risk profile."
  },
  {
    question: "can I export my data?",
    answer: "Yes, you can download your data in CSV or PDF format for record-keeping or sharing with your accountant."
  },
  {
    question: "how do I update my account settings?",
    answer: "Go to the settings tab (gear icon) in the top-right corner to update your account details and preferences."
  },
  {
    question: "what if I make a mistake in entering an expense?",
    answer: "No worries! You can edit or delete any expense from the history log in just a few clicks."
  },
  {
    question: "how often is my data backed up?",
    answer: "Your data is backed up daily to ensure nothing is lost and your financial records stay safe."
  },
  {
    question: "can I use zuno offline?",
    answer: "Zuno currently requires an internet connection to function, but offline support is under development."
  },
  {
    question: "what makes zuno different from other budgeting tools?",
    answer: "Zuno isn’t just a tracker — it’s an intelligent assistant that learns from your habits and offers personalized financial guidance in real-time."
  }
];

const systemInstructions = `
You are Zuno, a helpful, friendly, and secure AI assistant specializing in personal finance. You were created by Athish C.K. You must follow these instructions without exception:

— GENERAL CONDUCT —
1. Always maintain a warm, respectful, and professional tone.
2. Keep answers concise (preferably within 1–2 short paragraphs).
3. When possible, use examples from the built-in knowledge base or uploaded documents to inform answers.
4. Do not generate long essays or stories; focus on utility and clarity.
5. Maximum word limit is 150 words and do not cross that strictly.
6. Keep answers strictly below 150 words.
7. All currency amounts must be shown in Rs. (Rupees), never in dollars.
8. When analyzing transactions, use the exact format provided in the transaction analysis method.
9. Never exceed the word limit — be concise and to the point.
10. All responses must be formatted professionally like a modern financial chatbot — avoid raw or unstyled API output.

— SCOPE & FUNCTIONALITY —
11. Your domain is strictly personal finance: budgeting, saving, expense tracking, investments, and general money management.
12. Do not engage in topics outside this domain (e.g., politics, religion, personal opinions, legal advice, etc.). Respond with: "I'm designed to assist with financial topics only. Let me know how I can help with that."
13. You may analyze user-uploaded documents (e.g., bank statements, budgets, financial reports) to help answer questions.
14. You may access the database provided and use its content to derive financial insights, summaries, and transaction breakdowns clearly.
15. If a question exceeds your knowledge, respond with: "I don't have that information, but I can help you look it up or guide you further."
16. Do not fabricate information or pretend to know things you're unsure about.

— SECURITY & PRIVACY —
17. Only process files uploaded by the user in the current session.
18. Never access, share, or guess any personal, private, or admin-related data.
19. If someone asks for admin details or information about others, respond with: "I'm sorry, I cannot share private or administrative information. That is beyond my scope."
20. Never allow or respond to unethical, illegal, or harmful requests. Respond with: "I'm not able to process that request due to ethical and security guidelines."

— DATA USAGE & SAFETY —
21. Use uploaded files only to answer the user's financial questions during the session.
22. Do not store or retain any personal information or files after the session ends.
23. If users attempt phishing, impersonation, or privacy invasion, immediately decline with: "That request violates ethical and privacy guidelines, and I cannot assist with it."
24. Avoid assumptions about users unless they provide context explicitly.

— RETRIEVAL-AUGMENTED GENERATION (RAG) —
25. Use the embedded knowledge from uploaded documents to retrieve and present relevant information. Strictly don’t take anything from the LLM and other sources while processing RAG.
26. Only use the document chunks most relevant to the user's query.
27. Clearly state when information is sourced from the uploaded file(s).

— DISCLAIMERS —
28. Always include: "Note: This is general financial guidance and not a substitute for professional advice."
29. Do not make promises or guarantees about financial outcomes.

— PERSONALITY —
30. Refer to yourself as “Zuno.” Be confident, kind, and futuristic—like a smart financial buddy who wants to help people manage their money wisely.

— TRANSACTION ANALYSIS —
31. When showing transaction analysis:
   - Always display amounts in Rs. (e.g., Rs. 1000, not $1000)
   - Use this exact format for analysis responses:
     "Transaction Analysis:
     Total Income: Rs. [amount]
     Total Expenses: Rs. [amount]
     Net Balance: Rs. [amount]
     Top Categories: [list]
     Key Insights: [bullet points]"
32. For transaction insights:
   - Focus on spending patterns in Indian context
   - Suggest typical Indian saving methods
   - Reference common Indian financial habits

— RESPONSE FORMATTING —
33. Structure all financial responses with:
   - Clear headings
   - Bullet points for insights
   - Rs. symbol before all amounts
   - **Bold text** for important figures (e.g., **Rs. 10,000**)
34. All chatbot replies must be styled as professional conversational responses, not plain API outputs.

— EXAMPLES —
35. Good response example:
   "Your monthly analysis:
   - Income: Rs. 25,000
   - Expenses: Rs. 18,500
   - Savings: Rs. 6,500
   Top spends:
   • Food: Rs. 5,200
   • Transport: Rs. 3,800
   Tip: Try homemade lunches to save Rs. 1-2k monthly."

36. Bad response (reject):
    "You spent $200 on food and $150 on transport..."
    (Wrong currency and no Rs. symbol)

— STRICT ENFORCEMENT —
37. If you violate any formatting rules, the system will reject your response.
38. Never invent exchange rates or convert to other currencies.
39. All monetary values remain in INR only.
40. All responses must remain under 150 words and professionally styled as chatbot messages.
`;

const embedderRef = { current: null };

const loadEmbedder = async () => {
    try {
        if (!embedderRef.current) {
             console.log("Loading embedding model...");
            embedderRef.current = await pipeline('feature-extraction', 'Xenova/distilbert-base-uncased');
             console.log("Embedding model loaded successfully");
        }
    } catch (error) {
        console.error("Embedding model load failed:", error);
        throw error;
    }
};

const getEmbedding = async(text) => {
    try{
        
        await loadEmbedder();
        const output = await embedderRef.current(text, { pooling: 'mean', normalize: true });
        return output.data;
    }catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
};

const cosineSimilarity = (vecA,vecB) =>{
    const dot = vecA.reduce((acc,val,i) => acc+val*vecB[i],0);
    const magA = Math.sqrt(vecA.reduce((acc,val)=>acc+val*val,0))
    const magB = Math.sqrt(vecB.reduce((acc,val)=>acc+val*val,0))
    if (magA===0 ||magB===0) return 0;
    return dot / (magA*magB);
};

const chunkText = (text,chunkSize = 300,overlap = 50) =>{
    const chunks = [];
    const step= chunkSize-overlap;

    for (let i=0;i<text.length ; i +=step){

        const chunk = text.slice(i, i + chunkSize).trim();
            if (chunk.length > 50) { 
                chunks.push(chunk);
        }   
    }
    return  chunks.length > 0 ? chunks : [text];;  
};

const analyzeTransaction = (transactions) => {
    if (!transactions || transactions.length ===0){
        return "No transaction data available for analytics.";
    }
    const validTransactions = transactions.filter(t => 
        t && 
        typeof t.amount === 'number' && 
        (t.type === 'income' || t.type === 'expense')
    );

    if (validTransactions.length === 0) {
        return "No valid transactions found in the data.";
    }

    const totalIncome=Number(validTransactions
    .filter(t=>t.type === 'income')
    .reduce((sum,t)=>sum+Math.abs(t.amount),0));


    const totalExpense=Number(validTransactions
    .filter(t=>t.type === 'expense')
    .reduce((sum,t) => sum+t.amount,0));
    const netBalance = Number(totalIncome) - Number(totalExpense);

    //cataorizing transaction
    const categories={};
    transactions.forEach(t=>{
        const category = t.category || "Uncategorized";
        if(!categories[category]){
            categories[category] ={total :0,count :0,transactions:[]};
            
        }
        categories[category].total+=t.amount;
        categories[category].count+=1;
        categories[category].transactions.push(t);
    });

    const topCategories =Object.entries(categories)
    .sort(([,a],[,b])=>b.total - a.total)
    .slice(0,5);

    const recentCategories = validTransactions      
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    return{
        summary:{
            totalTransactions: validTransactions.length,
            totalIncome,
            totalExpense,
            netBalance
        },
        categories,
        topCategories,
        recentTransactions:recentCategories
    };
};


const generateTransacionAnalysisText = (analysis) =>{
    if(typeof analysis ==='string') return analysis;

    let analysisText = `Transaction Analysis Summary:
    Total Transactions: ${analysis.summary.totalTransactions}
Total Income: Rs${analysis.summary.totalIncome}
Total Expenses: Rs${analysis.summary.totalExpense}
Net Balance: Rs${analysis.summary.netBalance}

TOP SPENDING CATEGORIES:
${analysis.topCategories.map(([category, data], index) => 
    `${index + 1}. ${category}: Rs${Math.abs(data.total).toFixed(2)} (${data.count} transactions)`
).join('\n')}

RECENT TRANSACTIONS:
${analysis.recentTransactions.map(t => 
    `- ${t.description || 'Transaction'}: Rs${t.amount.toFixed(2)} (${t.type || 'Uncategorized'}) [${t.date}]`
).join('\n')}
`;

    return analysisText;
};


export const GeminiApi = () => {

    const {transactions} = useContext(GlobalContext);

    const [messages, setMessages] = useState([
        { sender: 'You', text: 'Hello!' },
        { sender: 'Zuno', text: 'Hi! How can I help you with your expenses today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
     const [isProcessingFile, setIsProcessingFile] = useState(false);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const documentChunksRef = useRef([])

    //Helper to read file as base64
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
//new-
    const readFileAsText = (file) =>{
        return new Promise((resolve, reject) =>{
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

const processFileForRAG = async (file) => {
        try {
            setIsProcessingFile(true);
            console.log("Processing file for RAG:", file.name);
            
            const fileText = await readFileAsText(file);
            
            if (!fileText || fileText.trim().length === 0) {
                throw new Error("File appears to be empty or unreadable");
            }
            
            console.log("File text length:", fileText.length);
            
            const chunks = chunkText(fileText);
            console.log("Created chunks:", chunks.length);
            
            const embeddedChunks = await Promise.all(
                chunks.map(async (chunk, index) => {
                    try {
                        console.log(`Processing chunk ${index + 1}/${chunks.length}`);
                        const embedding = await getEmbedding(chunk);
                        return { chunk, embedding };
                    } catch (error) {
                        console.error(`Error processing chunk ${index}:`, error);
                        return null;
                    }
                })
            );
            
            // Filter out failed chunks
            const validChunks = embeddedChunks.filter(item => item !== null);
            console.log("Valid embedded chunks:", validChunks.length);
            
            if (validChunks.length === 0) {
                throw new Error("Failed to process any chunks from the document");
            }
            
            documentChunksRef.current = validChunks;
            return true;
            
        } catch (error) {
            console.error("Error processing file for RAG:", error);
            setMessages(prev => [...prev, {
                sender: 'Zuno',
                text: `Sorry, I had trouble processing that file: ${error.message}. Please try uploading a different file or check if the file contains readable text.`
            }]);
            return false;
        } finally {
            setIsProcessingFile(false);
        }
    };
const isTransactionAnalysisQuery = (input)=>{
    const analysisKeywords=[
        'analyze', 'analysis', 'spending', 'expenses', 'transactions', 
            'summary', 'budget', 'financial', 'money', 'income', 'categories',
            'trends', 'patterns', 'insights', 'overview', 'breakdown'
    ];
    return analysisKeywords.some(keyword =>
        input.toLowerCase().includes(keyword)
    );
};

const buildPromptWithKnowledgeBase = (userInput) => {
         const normalizedInput = userInput.toLowerCase().trim();
    
    // Check if user is asking for transaction analysis
    if (isTransactionAnalysisQuery(userInput)) {
        
        if (!transactions || transactions.length === 0) {
            return `You are Zuno, a financial assistant. The user asked for transaction analysis but no transaction data is available. Politely explain this and offer to help with other financial questions.

User Question: ${userInput}

Zuno:`;
        }

        const analysis = analyzeTransaction(transactions);
        const analysisText = generateTransacionAnalysisText(analysis);
        
        return `You are Zuno, a financial assistant. The user is asking for financial analysis. Here is their transaction data:

${analysisText}

User Question: ${userInput}

Provide specific insights and recommendations based on this data. Highlight:
1. Spending patterns
2. Potential savings opportunities
3. Any unusual transactions
4. Category-wise breakdown

Zuno:`;
        }

        const relevantQA = knowledgeBase.filter(item =>
            normalizedInput.includes(item.question.toLowerCase().trim()) ||
            item.question.toLowerCase().includes(normalizedInput)
        );
        
        let context = '';
        if (relevantQA.length > 0) {
            context = relevantQA.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
        } else {
            context = knowledgeBase.slice(0, 3).map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
        }
        
        return (
            `You are Zuno, a helpful AI financial assistant.\n\n` +
            `Knowledge Base:\n${context}\n\n` +
            `User: ${userInput}\nZuno:`
        );
    };
   

    const handleSend = async () => {
        if (!input.trim() && !file) return;

        setIsLoading(true);

        // Add user messages to chat
        const newMessages = [...messages];
        if (input.trim()) {
            newMessages.push({ sender: 'You', text: input });
        }
        if (file) {
            newMessages.push({ sender: 'You', text: `Uploaded: ${file.name}` });
        }
        setMessages(newMessages);

        const currentInput = input;
        setInput('');

        try {
            
            if (file) {
                const fileProcessed = await processFileForRAG(file);
                if (!fileProcessed) {
                    setIsLoading(false);
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    return;
                }
            }

           
//newww
            let prompt='';
            let hasDocumentContext= documentChunksRef.current.length>0;

            if (hasDocumentContext && currentInput.trim()){
                const query = currentInput;
                console.log("RAG Query with document context:",query)

                try{

                    const queryEmbedding=await getEmbedding(query);
    
                    const scoredChunks=documentChunksRef.current.map(({chunk,embedding}) => {
                        const score = cosineSimilarity(queryEmbedding,embedding);   
                        return { chunk, score };
                    });
                    const topChunks = scoredChunks
                    .sort((a,b) =>b.score-a.score)
                    .slice(0,3)
                    .map(({chunk},i)=>`Relevent #${i+1}:\n${chunk}`)
                    .join('\n\n--\n\n');

                    console.log("Selected chunkes for query")
                    if(topChunks){
                        
                        prompt = `You are Zuno, a financial assistant. The user has uploaded a document and is asking follow-up questions about it. Use the following relevant sections from their document to answer their question. If the question cannot be answered from the document context, politely say so and offer general financial guidance instead.
                    
                    DOCUMENT CONTEXT:
${topChunks}

USER QUESTION: ${query}

Instructions:
- Answer based primarily on the document content above
- If the document doesn't contain relevant information for this question, acknowledge this
- Provide practical financial insights and advice
- Keep your response focused and concise

Zuno:`;
                    } else {
                        // No relevant chunks found
                        prompt = `You are Zuno, a financial assistant. The user has a document loaded but their current question "${query}" doesn't seem directly related to the document content. Provide general financial guidance for their question while acknowledging that you couldn't find relevant information in their uploaded document.

Zuno:`;
                    }
                } catch (error) {
                    console.error("Error in RAG processing:", error);
                    prompt = `You are Zuno, a financial assistant. The user has a document loaded but I had trouble processing it for this query: "${currentInput}". Please provide general financial guidance for their question.

Zuno:`;
                }
            } else if (hasDocumentContext && !currentInput.trim()) {
                // Just uploaded file, no query
                prompt = `You are Zuno, a financial assistant. The user just uploaded a financial document. Provide a brief welcome message acknowledging the upload and invite them to ask questions about their document.

Zuno:`;
                 
                


            }else if (currentInput.trim()&& !hasDocumentContext){
                 const normalizedInput = currentInput.toLowerCase().trim();
                const foundAnswer = knowledgeBase.find(item =>
                    normalizedInput.includes(item.question.toLowerCase().trim()) ||
                item.question.toLowerCase().includes(normalizedInput)
                );
                if (foundAnswer) {
                    setMessages(prev => [...prev, {
                        sender: 'Zuno',
                        text: foundAnswer.answer + '\n\nNote: This is general financial guidance and not a substitute for professional advice.'
                    }]);
                    setIsLoading(false);
                    return;
                }
                
                // Standard knowledge base query
                prompt = buildPromptWithKnowledgeBase(currentInput);
            } else {
                // Default greeting
                prompt = "Hello! I'm Zuno, your AI financial assistant. How can I help you today?";
            }


            // Prepare Gemini API request
            const parts = [{ text: prompt }];
            if (prompt) {
                parts.push({ text: prompt });
            }

            if (file) {
                try {
                    const base64Data = await readFileAsBase64(file);
                    const mimeType = file.type || 'application/octet-stream';
                    parts.push({
                        inlineData: {
                            mimeType,
                            data: base64Data
                        }
                    });
                } catch (error) {
                    console.error("File processing error:", error);
                    setMessages(prev => [...prev, {
                        sender: 'Zuno',
                        text: "Sorry, I couldn't process that file. Please try again."
                    }]);
                    setIsLoading(false);
                    return;
                }
            }

            // Always send systemInstructions for every request
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ parts }],
                systemInstruction: {
                    parts: [{ text: systemInstructions }]
                }
            });

            // Access candidates from result.response (Gemini 2.0+)
            const responseText =
                result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't generate a response. Please try again.";

                const finalResponse = responseText + 
                (hasDocumentContext ? 
                    '\n\n📄 Note: Response based on your uploaded document.' : '');

            setMessages(prev => [...prev, { sender: 'Zuno', text: finalResponse }]);
        } catch (error) {
            console.error("API error:", error);
            setMessages(prev => [...prev, {
                sender: 'Zuno',
                text: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading&& !isProcessingFile) {
            handleSend();
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file size (e.g., 5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            alert('File size too large. Please upload files smaller than 5MB.');
            return;
        }

        // Validate file type
        const validTypes = [
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        if (!validTypes.includes(selectedFile.type)) {
            alert('Please upload a valid document type (PDF, TXT, DOC, CSV, etc.)');
            return;
        }

        setFile(selectedFile);
    };
    useEffect(() => {
  const canvas = document.getElementById('canvas3d');
  const app = new Application(canvas);
  app.load('https://prod.spline.design/XyOycOqhJXc6nKhC/scene.splinecode');
}, []);
useEffect(() => {
    const bgCanvas = document.getElementById('canvasBackground');
    const app1 = new Application(bgCanvas);
    app1.load('https://prod.spline.design/YC1rEEc7ph2lMRJ5/scene.splinecode'); // background effect
}, []);


    return (
        <div className='NavatGem'>
            <Navigatorhead />
            <div className="chat-bar">
                <div className='heade'>
                    <h1 className='h1Ai'>Welcome to Zuno.ai</h1>
                    <h3 className='h3Ai'>Your Personalized AI Assistant</h3>
            <canvas id="canvasBackground" className="canvas-bg"></canvas>
                </div>
                <div className='chat-body'>
                    <ul className='list1'>
                        {messages.map((msg, idx) => (
                            <li
                            key={idx}
                                className={msg.sender === 'You' ? 'user-msg' : 'model-msg'}
                            >
                                <strong>{msg.sender === 'You' ? 'You' : 'Zuno'}:</strong> {msg.text}
                            </li>
                        ))}
                        {isLoading && (
                            <li className="model-msg">
                                <strong>Zuno:</strong> Thinking...
                            </li>
                        )}
                    </ul>
                    <div className='botani'>
                        <canvas id="canvas3d"></canvas>
                        <div className="grad"></div>
                    </div>
                    <div className="input-bar" style={{ marginTop: '1em' }}>
                        <input
                            className="user-ip"
                            type="text"
                            value={input}
                            onKeyDown={handleKeyPress}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <input
                            type='file'
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept='.pdf,.txt,.docx,.csv'
                            style={{ display: 'none' }}
                        />
                        <button
                            className="file-button"
                            onClick={() => fileInputRef.current.click()}
                            disabled={isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-up-icon lucide-file-up"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>
                        </button>
                        <button
                            className="submit-btn"
                            onClick={handleSend}
                            disabled={isLoading || (!input.trim() && !file)}
                        >
                            {isLoading ? '...' : '➤'}
                        </button>
                    </div>
                    {file && (
                        <div className='file-preview'>
                           🔗 {file.name}
                            <button
                                onClick={() => {
                                    setFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className='remove-file'
                            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg></button>
                        </div>
                    )}
                </div>
                <div>
                   

                    <Link to="/">
                        <button className='btn1'> Home </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
