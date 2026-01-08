const express = require('express');
const cors = require('cors');

const app = express(); // 1. app 객체를 가장 먼저 생성해야 합니다!

// 2. 그 다음 설정을 붙입니다. (순서가 중요해요)
app.use(cors()); 
app.use(express.json());

// Codespaces 환경 변수 PORT 설정
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Doo Project Backend is Running on Codespaces!');
});

// 할 일 목록 데이터 (필드명 text로 통일)
let todos = [
  { id: 1, text: "Codespaces에서 백엔드 시작하기", completed: false }
];

// [GET] 목록 조회
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// [POST] 새로운 할 일 추가
app.post('/api/todos', (req, res) => {
    const { text, date, time, desc } = req.body; 

    const newTodo = {
        id: Date.now(),
        text: text,
        date: date,
        time: time,
        desc: desc,
        completed: false,
        createdAt: new Date()
    };

    todos.push(newTodo);
    console.log("새로운 할 일이 추가됨:", newTodo);
    res.status(201).json(newTodo);
});

// [DELETE] 할 일 삭제
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id !== parseInt(id));
    res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});