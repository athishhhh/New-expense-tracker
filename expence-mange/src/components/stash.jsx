{/*
___________________________________________________________________s1_____________________________________________________________________

export const GeminiApi = () => {
  const [messages, setMessages] = useState([
    { sender: 'You', text: 'Hello!' },
    { sender: 'Zuno', text: 'Hi! How can I help you with your expenses today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const readFileAsArrayBuffer  = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      // Check knowledge base for text queries only
      if (currentInput.trim() && !file) {
        const normalizedInput = currentInput.toLowerCase().trim();
        const foundAnswer = knowledgeBase.find(item =>
          normalizedInput.includes(item.question.toLowerCase().trim())
        );
        
        if (foundAnswer) {
          setMessages(prev => [...prev, { 
            sender: 'Zuno', 
            text: foundAnswer.answer + ' Note: This is general financial guidance and not a substitute for professional advice.' 
          }]);
          setIsLoading(false);
          return;
        }
      }

      const contents = [];
      if(currentInput.trim()){
        contents.push({text : currentInput});
      }


    //   // Prepare the request for Gemini API
    //   const request = {
    //     model: "gemini-2.0-flash", // Updated model version
    //     contents: [{
    //       parts: []
    //     }],
    //     systemInstruction: {
    //       parts: [{ text: systemInstructions }]
    //     }
    //   };

    //   // Add text input if exists
    //   if (currentInput.trim()) {
    //     request.contents[0].parts.push({ text: currentInput });
    //   }

      // Add file if exists
      if (file) {
        try {
         const fileBuffer = await readFileAsArrayBuffer(file);
         const base64Data = Buffer.from(fileBuffer).toString('base64');
          
          contents.push({
            inlineData: {
              mimeType: file.type,
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

      // Send to Gemini API
    //   const result = await ai.models.generateContent(request);
      
    //   let responseText = "I couldn't process your request";
    //   if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    //     responseText = result.response.candidates[0].content.parts[0].text;
    //   }
      
    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents:contents,
        systemInstructions:{
            parts: [{ text: systemInstructions }]
        }
    });

    const response = result.response;
    const responseText= response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         "I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, { sender: 'Zuno', text: responseText }]);

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
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className='NavatGem'>
      <Navigatorhead />
      <div className="chat-bar">
        <div className='heade'>
          <h1 className='h1Ai'>Welcome to Zuno.ai</h1>
          <h3 className='h3Ai'>Your Personalized AI Assistant</h3>
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
              style={{display:'none'}} 
            />
            <button 
              className="file-button"
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
            >
              🔗
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
              {file.name}
              <button 
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className='remove-file'
              >
                x
              </button>
            </div>
          )}
        </div>
        <div>
          <Link to="/">
            <button className='btn1'>Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};


-------------------------------------------------------------------s2------------------------------------------------------------------------------
export const GeminiApi = () => {
  const [messages, setMessages] = useState([
    { sender: 'You', text: 'Hello!' },
    { sender: 'Zuno', text: 'Hi! How can I help you with your expenses today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    setIsLoading(true);
    const newMessages = [...messages];
    if (input.trim()) newMessages.push({ sender: 'You', text: input });
    if (file) newMessages.push({ sender: 'You', text: `Uploaded: ${file.name}` });
    setMessages(newMessages);

    const currentInput = input;
    setInput('');

    try {
      // Check knowledge base first
      if (currentInput.trim() && !file) {
        const normalizedInput = currentInput.toLowerCase().trim();
        const foundAnswer = knowledgeBase.find(item =>
          normalizedInput.includes(item.question.toLowerCase().trim())
        );
        if (foundAnswer) {
          setMessages(prev => [...prev, { 
            sender: 'Zuno', 
            text: foundAnswer.answer + ' Note: This is general financial guidance.' 
          }]);
          setIsLoading(false);
          return;
        }
      }

      // Prepare request parts
      const parts = [];
      if (currentInput.trim()) parts.push({ text: currentInput });

      // Handle file upload
      if (file) {
        try {
          const base64Data = await readFileAsBase64(file);
          parts.push({
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          });
        } catch (error) {
          console.error("File error:", error);
          setMessages(prev => [...prev, {
            sender: 'Zuno',
            text: "Sorry, I couldn't process that file. Please try a different file."
          }]);
          setIsLoading(false);
          return;
        }
      }

      // Generate content
      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts }],
        systemInstruction: {
          parts: [{ text: systemInstructions }]
        }
      });

      const response = await result.response;
      const responseText = response.candidates[0].content.parts[0].text || 
                         "I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, { sender: 'Zuno', text: responseText }]);
      
    } catch (error) {
      console.error("API error:", error);
      setMessages(prev => [...prev, { 
        sender: 'Zuno', 
        text: error.message.includes('400') 
          ? "Sorry, I couldn't process that file format. Please try PDF, TXT, DOCX, or CSV."
          : "Sorry, I encountered an error. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic validation
      const validTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv'
      ];
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF, TXT, DOCX, or CSV file');
      }
    }
  };

  return (
    <div className='NavatGem'>
      <Navigatorhead />
      <div className="chat-bar">
        <div className='heade'>
          <h1 className='h1Ai'>Welcome to Zuno.ai</h1>
          <h3 className='h3Ai'>Your Personalized AI Assistant</h3>
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
              style={{display:'none'}} 
            />
            <button 
              className="file-button"
              onClick={() => fileInputRef.current.click()}
              disabled={isLoading}
            >
              🔗
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
              {file.name}
              <button 
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className='remove-file'
              >
                x
              </button>
            </div>
          )}
        </div>
        <div>
          <Link to="/">
            <button className='btn1'>Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
*/}
/*-----------------------------------------------------------------tester---------------------------------------------------------------------------
export const GeminiApi = () => {
    const [messages, setMessages] = useState([
        { sender: 'You', text: 'Hello!' },
        { sender: 'Zuno', text: 'Hi! How can I help you with your expenses today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

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
            // Check knowledge base for text queries only
            if (currentInput.trim() && !file) {
                const normalizedInput = currentInput.toLowerCase().trim();
                const foundAnswer = knowledgeBase.find(item =>
                    normalizedInput.includes(item.question.toLowerCase().trim())
                );
                if (foundAnswer) {
                    setMessages(prev => [...prev, {
                        sender: 'Zuno',
                        text: foundAnswer.answer + ' Note: This is general financial guidance and not a substitute for professional advice.'
                    }]);
                    setIsLoading(false);
                    return;
                }
            }

            // Prepare Gemini API request
            const parts = [];
            if (currentInput.trim()) {
                parts.push({ text: currentInput });
            } else if (file) {
                parts.push({ text: "Analyze this document and provide relevant information." });
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

            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [{ parts }],
                systemInstruction: {
                    parts: [{ text: systemInstructions }]
                }
            });

            // Access candidates from result.response
           const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't generate a response. Please try again.";

            setMessages(prev => [...prev, { sender: 'Zuno', text: responseText }]);
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
        if (e.key === 'Enter' && !isLoading) {
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

    return (
        <div className='NavatGem'>
            <Navigatorhead />
            <div className="chat-bar">
                <div className='heade'>
                    <h1 className='h1Ai'>Welcome to Zuno.ai</h1>
                    <h3 className='h3Ai'>Your Personalized AI Assistant</h3>
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
                            🔗
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
                            {file.name}
                            <button
                                onClick={() => {
                                    setFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className='remove-file'
                            >x</button>
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
};--------------------------------------------------------------main program in case it dies -----------------------------------------------------------
*/

/*
import React,{useState,useRef} from 'react'
import { GoogleGenAI } from '@google/genai'
import { Link } from 'react-router-dom'
import { Navigatorhead } from './Navigatorhead';



const ai = new GoogleGenAI({ apiKey: "AIzaSyCjV9bjhvhORRpNSSWofI5yw5VBQH6JhaY" });


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
    answer: "Zuno was created by Athish C.K — a passionate AI enthusiast from Shiv Nadar University, Chennai."
  },
  {
    question: "who is your god?",
    answer: "It's Athish — the visionary behind Zuno!"
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

— SCOPE & FUNCTIONALITY —
5. Your domain is strictly personal finance: budgeting, saving, expense tracking, investments, and general money management.
6. Do not engage in topics outside this domain (e.g., politics, religion, personal opinions, legal advice, etc.). Respond with: "I'm designed to assist with financial topics only. Let me know how I can help with that."
7. You may analyze user-uploaded documents (e.g., bank statements, budgets, financial reports) to help answer questions.
8. If a question exceeds your knowledge, respond with: "I don't have that information, but I can help you look it up or guide you further."
9. Do not fabricate information or pretend to know things you're unsure about.

— SECURITY & PRIVACY —
10. Only process files uploaded by the user in the current session.
11. Never access, share, or guess any personal, private, or admin-related data.
12. If someone asks for admin details or information about others, respond with: "I'm sorry, I cannot share private or administrative information. That is beyond my scope."
13. Never allow or respond to unethical, illegal, or harmful requests. Respond with: "I'm not able to process that request due to ethical and security guidelines."

— DATA USAGE & SAFETY —
14. Use uploaded files only to answer the user's financial questions during the session.
15. Do not store or retain any personal information or files after the session ends.
16. If users attempt phishing, impersonation, or privacy invasion, immediately decline with: "That request violates ethical and privacy guidelines, and I cannot assist with it."
17. Avoid assumptions about users unless they provide context explicitly.

— RETRIEVAL-AUGMENTED GENERATION (RAG) —
18. Use the embedded knowledge from uploaded documents to retrieve and present relevant information.
19. Only use the document chunks most relevant to the user's query.
20. Clearly state when information is sourced from the uploaded file(s).

— DISCLAIMERS —
21. Always include: "Note: This is general financial guidance and not a substitute for professional advice."
22. Do not make promises or guarantees about financial outcomes.

— PERSONALITY —
23. Refer to yourself as “Zuno.” Be confident, kind, and futuristic—like a smart financial buddy who wants to help people manage their money wisely.

`;



export const GeminiApi = () => {
    const [messages, setMessages] = useState([
        { sender: 'You', text: 'Hello!' },
        { sender: 'Zuno', text: 'Hi! How can I help you with your expenses today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    // Helper to read file as base64
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

    // Helper to build the prompt with knowledge base context
    const buildPromptWithKnowledgeBase = (userInput) => {
        // Find relevant Q&A from knowledge base
        const normalizedInput = userInput.toLowerCase().trim();
        const relevantQA = knowledgeBase.filter(item =>
            normalizedInput.includes(item.question.toLowerCase().trim())
        );
        let context = '';
        if (relevantQA.length > 0) {
            context = relevantQA.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
        } else {
            // Optionally, include all Q&A as context for generalization
            context = knowledgeBase.slice(0, 5).map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
        }
        // Compose the prompt
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
            // Check knowledge base for direct match (fast path)
            if (currentInput.trim() && !file) {
                const normalizedInput = currentInput.toLowerCase().trim();
                const foundAnswer = knowledgeBase.find(item =>
                    normalizedInput.includes(item.question.toLowerCase().trim())
                );
                if (foundAnswer) {
                    setMessages(prev => [...prev, {
                        sender: 'Zuno',
                        text: foundAnswer.answer + ' Note: This is general financial guidance and not a substitute for professional advice.'
                    }]);
                    setIsLoading(false);
                    return;
                }
            }

            // Build prompt with knowledge base context
            let prompt = '';
            if (currentInput.trim()) {
                prompt = buildPromptWithKnowledgeBase(currentInput);
            } else if (file) {
                prompt = "Analyze this document and provide relevant financial insights as Zuno.";
            }

            // Prepare Gemini API request
            const parts = [];
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

            setMessages(prev => [...prev, { sender: 'Zuno', text: responseText }]);
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
        if (e.key === 'Enter' && !isLoading) {
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

    return (
        <div className='NavatGem'>
            <Navigatorhead />
            <div className="chat-bar">
                <div className='heade'>
                    <h1 className='h1Ai'>Welcome to Zuno.ai</h1>
                    <h3 className='h3Ai'>Your Personalized AI Assistant</h3>
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
                            🔗
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
                            {file.name}
                            <button
                                onClick={() => {
                                    setFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className='remove-file'
                            >x</button>
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
 // Helper to build the prompt with knowledge base context
    // const buildPromptWithKnowledgeBase = (userInput) => {
   
    // const normalizedInput = userInput.toLowerCase().trim();
    //     const relevantQA = knowledgeBase.filter(item =>
    //         normalizedInput.includes(item.question.toLowerCase().trim()) ||
    //         item.question.toLowerCase().includes(normalizedInput)
    //     );
        
    //     let context = '';
    //     if (relevantQA.length > 0) {
    //         context = relevantQA.map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
    //     } else {
    //         // Include some general context
    //         context = knowledgeBase.slice(0, 3).map(item => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n');
    //     }
        
    //     return (
    //         `You are Zuno, a helpful AI financial assistant.\n\n` +
    //         `Knowledge Base:\n${context}\n\n` +
    //         `User: ${userInput}\nZuno:`
    //     );
    // };
*/