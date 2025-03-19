import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // 메시지 추가 및 계산 함수
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 사용자 입력 메시지 추가
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
          // 수식에서 숫자와 연산자 추출 (예: "5 + 6 ")
          const operationRegex = /(-?\d+(\.\d+)?)\s*([+\-*/])?\s*/g; // 숫자와 연산자 추출을 위한 정규 표현식
          const matches = [...input.matchAll(operationRegex)]; // 모든 일치 항목 찾기

          // 숫자와 연산자를 배열로 변환
          const numbers = [];
          const operators = [];
          for (let i = 0; i < matches.length; i++) {
            if (matches[i][1]) {
              numbers.push(parseFloat(matches[i][1])); // 숫자 추가
            }
            if (matches[i][3]) {
              operators.push(matches[i][3]); // 연산자 추가
            }
          }

          // 숫자와 연산자의 개수 확인
          if (numbers.length < 2 || numbers.length !== operators.length + 1) {
            const errorMessage = "입력 예시: (e.g., 5 + 6 ). 최대 10개까지의 연산이 가능합니다.";
            setMessages([...newMessages, { sender: "bot", text: errorMessage }]);
            return;
          }

          // 계산 수행
          let result = numbers[0];
          for (let i = 0; i < operators.length; i++) {
            switch (operators[i]) {
              case "+":
                result += numbers[i + 1];
                break;
              case "-":
                result -= numbers[i + 1];
                break;
              case "*":
                result *= numbers[i + 1];
                break;
              case "/":
                if (numbers[i + 1] === 0) { // 0으로 나누면 나눗셈 오류 발생. 그래서 따로 처리
                  const errorMessage = "애러: Zero Division.";
                  setMessages([...newMessages, { sender: "bot", text: errorMessage }]);
                  return;
                }
                result /= numbers[i + 1];
                break;
              default:
                break;
            }
          }

          // 결과 메시지 추가
          setMessages([...newMessages, { sender: "bot", text: `결과: ${result}` }]);
        } catch (error) {
          console.error("연산 중 애러 발생:", error);
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
            background-color: #28a745;;
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
          box-sizing: border-box; /* 박스 모델을 border-box로 설정 */
          flex-grow: 1;
          padding-left: 10px;
          padding-right: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          width: 100%; /* 너비를 100%로 설정 */
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
          box-sizing: border-box; /* 박스 모델을 border-box로 설정 */
          display: flex;
          padding: 10px;
          background-color: #fff;
          border-top: 1px solid #ccc;
          width: 100%; /* 너비를 100%로 설정 */
          justify-content: center; /* 수평 중앙 정렬 */
        }

        input {
          flex-grow: 1;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-right: 10px; /* 버튼과의 간격 */
        }

        button {
          padding: 10px 20px;
          margin-left: 10px;
          font-size: 16px;
          background-color: #28a745;;
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
