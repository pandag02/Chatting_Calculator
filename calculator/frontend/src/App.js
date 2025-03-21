import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const operationRegex = /(-?\d+(\.\d+)?)\s*([+\-*/])?\s*/g;
      const matches = [...input.matchAll(operationRegex)];
      const numbers = [];
      const operators = [];

      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1]) numbers.push(parseFloat(matches[i][1]));
        if (matches[i][3]) operators.push(matches[i][3]);
      }

      if (numbers.length < 2 || numbers.length !== operators.length + 1) {
        const errorMessage = "입력 예시: (e.g., 5 + 6 ). 최대 10개까지의 연산이 가능합니다.";
        setMessages([...newMessages, { sender: "bot", text: errorMessage }]);
        return;
      }

      const operationMap = {
        "+": "add",
        "-": "subtract",
        "*": "multiply",
        "/": "divide",
      };

      let result = numbers[0];

      for (let i = 0; i < operators.length; i++) {
        const operation = operationMap[operators[i]];

        if (!operation) {
          setMessages([...newMessages, { sender: "bot", text: "잘못된 연산자입니다." }]);
          return;
        }

        // Render에서 배포된 Spring Boot API URL 사용
        const response = await fetch(
          `https://chattingcalculator.onrender.com/calculate?num1=${result}&operation=${operation}&num2=${numbers[i + 1]}`
        );
        const apiResult = await response.text();
        result = parseFloat(apiResult);
      }

      setMessages([...newMessages, { sender: "bot", text: `결과: ${result}` }]);
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
      setMessages([...newMessages, { sender: "bot", text: "연산 중 문제가 발생하였습니다." }]);
    }
  };


  return (
    <div className="chat-container">
      <div className="navbar">
        <div className="navbar-title">Calculation</div>
      </div>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="입력 예시: (e.g., 5 + 6 ). 최대 10개까지의 연산이 가능합니다."
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .navbar {
          background-color: #28a745;
          padding: 10px;
          text-align: center;
          color: white;
          font-size: 24px;
        }

        .chat-container {
          width: 800px;
          margin: 100px auto;
          display: flex;
          flex-direction: column;
          height: 500px;
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow: hidden;
          background-color: #f4f4f9;
        }

        .chat-box {
          box-sizing: border-box;
          flex-grow: 1;
          padding-left: 10px;
          padding-right: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .message {
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          max-width: 70%;
          word-wrap: break-word;
        }

        .user-message {
          background-color: #007bff;
          color: white;
          align-self: flex-end;
        }

        .bot-message {
          background-color: #e0e0e0;
          color: black;
          align-self: flex-start;
        }

        .input-box {
          box-sizing: border-box;
          display: flex;
          padding: 10px;
          background-color: #fff;
          border-top: 1px solid #ccc;
          width: 100%;
          justify-content: center;
        }

        input {
          flex-grow: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 10px;
        }

        button {
          padding: 10px 20px;
          margin-left: 10px;
          font-size: 16px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default App;
